import React, { createContext, useContext, useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, useSortable, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@iconify-icon/react';
import useInteractiveModeStore from '../../hooks/useInteractiveMode';

// WIDGET_TYPES for the add modal
const WIDGET_TYPES = [
  { type: 'clock', name: 'Clock', icon: 'mdi:clock-outline', description: 'Digital clock with time and greetings', span: 1 },
  { type: 'clock2', name: 'Clock (Wide)', icon: 'mdi:clock-outline', description: 'Large clock spanning 2 cells', span: 2 },
  { type: 'date', name: 'Date', icon: 'mdi:calendar', description: 'Current date display', span: 1 },
  { type: 'date2', name: 'Date (Wide)', icon: 'mdi:calendar', description: 'Large date display spanning 2 cells', span: 2 },
  { type: 'cardbox', name: 'Cards', icon: 'mdi:cards', description: 'Quick access links', span: 1 },
  { type: 'listbox', name: 'Lists', icon: 'mdi:format-list-bulleted', description: 'Todo list or bookmarks', span: 1 },
  { type: 'memo', name: 'Memo', icon: 'mdi:note-text', description: 'Quick notes', span: 1 },
  { type: 'weather', name: 'Weather', icon: 'mdi:weather-partly-cloudy', description: 'Weather information', span: 1 },
  { type: 'empty', name: 'Empty', icon: 'mdi:plus-box-outline', description: 'Empty space', span: 1 },
];

const WIDGET_SPANS = { clock: 1, clock2: 2, date: 1, date2: 2, cardbox: 1, listbox: 1, memo: 1, weather: 1, empty: 1 };

const InteractiveModeContext = createContext(null);

// Sortable Widget Wrapper Component
function SortableWidget({ children, widgetType, index, isInteractiveMode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widgetType });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, position: 'relative', height: '100%' };

  if (!isInteractiveMode) return children;

  return (
    <div ref={setNodeRef} style={style} className="interactive-widget relative group">
      <div {...attributes} {...listeners} className="absolute inset-0 z-10 cursor-move" title="Drag to reorder" />
      <div className="h-full w-full">{children}</div>
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <WidgetControls widgetType={widgetType} index={index} />
      </div>
      <div className="absolute bottom-2 left-2 z-20 opacity-0 group-hover:opacity-50 transition-opacity">
        <Icon icon="mdi:drag" className="text-white text-sm" />
      </div>
    </div>
  );
}

// Widget Controls Component
function WidgetControls({ widgetType, index }) {
  const store = useInteractiveModeStore();
  const { handleDeleteWidget, handleOpenSettings } = store || {};
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasSettings = ['clock', 'clock2', 'date', 'date2', 'cardbox', 'listbox', 'memo', 'weather'].includes(widgetType);

  return (
    <>
      <div className="flex gap-1 bg-black/50 backdrop-blur-sm rounded-lg p-1">
        {hasSettings && (
          <button onClick={() => handleOpenSettings?.(index)} className="p-1 text-white hover:bg-blue-500/50 rounded" title="Settings">
            <Icon icon="mdi:cog" />
          </button>
        )}
        <button onClick={() => setShowDeleteConfirm(true)} className="p-1 text-white hover:bg-red-500/50 rounded" title="Delete Widget">
          <Icon icon="mdi:close" />
        </button>
      </div>
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowDeleteConfirm(false)}>
          <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', maxWidth: '400px', color: 'white' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 10px 0' }}>Delete Widget</h3>
            <p style={{ margin: '0 0 20px 0', color: '#aaa' }}>
              Are you sure you want to delete this widget?
              {widgetType === 'listbox' && ' This will also delete all your list items.'}
              {widgetType === 'cardbox' && ' This will also delete all your cards.'}
              {widgetType === 'memo' && ' This will also delete your memo content.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #444', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { handleDeleteWidget?.(widgetType); setShowDeleteConfirm(false); }} style={{ padding: '8px 16px', background: '#e53e3e', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Add Widget Modal
function AddWidgetModal({ open, onClose, onAdd }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ backgroundColor: '#1a1a1a', padding: '24px', borderRadius: '12px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto', color: 'white' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Add Widget</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px' }}><Icon icon="mdi:close" /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
          {WIDGET_TYPES.map(widget => (
            <div key={widget.type} onClick={() => onAdd(widget.type)} style={{ backgroundColor: '#2a2a2a', padding: '16px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #333', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icon icon={widget.icon} style={{ fontSize: '20px' }} /><span style={{ fontWeight: 500 }}>{widget.name}</span></div>
                {widget.span > 1 && <span style={{ fontSize: '12px', backgroundColor: '#3b82f6', padding: '2px 8px', borderRadius: '4px' }}>{widget.span} cells</span>}
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{widget.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Provider Component
export default function InteractiveModeProvider({ config, onConfigUpdate, children }) {
  const { initialize, saveInteractiveMode } = useInteractiveModeStore();
  const [items, setItems] = useState(config.layout.items || []);
  const [activeId, setActiveId] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsWidgetIndex, setSettingsWidgetIndex] = useState(null);
  const [interactiveModeState, setInteractiveModeState] = useState(false);

  useEffect(() => {
    initialize();
    const unsubscribe = useInteractiveModeStore.subscribe(state => setInteractiveModeState(state.isInteractiveMode));
    setInteractiveModeState(useInteractiveModeStore.getState().isInteractiveMode);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (config?.layout?.items) setItems(config.layout.items);
  }, [config?.layout?.items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        setItems(newItems);
        onConfigUpdate({ ...config, layout: { ...config.layout, items: newItems } });
      }
    }
  };

  const handleDeleteWidget = (widgetType) => {
    const newItems = items.filter(item => item !== widgetType);
    setItems(newItems);
    onConfigUpdate({ ...config, layout: { ...config.layout, items: newItems } });
  };

  const handleAddWidget = (widgetType) => {
    const newItems = [...items, widgetType];
    setItems(newItems);
    onConfigUpdate({ ...config, layout: { ...config.layout, items: newItems } });
    setAddModalOpen(false);
  };

  const handleToggleInteractiveMode = () => saveInteractiveMode(!interactiveModeState);

  const value = { isInteractiveMode: interactiveModeState, handleDeleteWidget, handleOpenSettings: (i) => { setSettingsWidgetIndex(i); setSettingsModalOpen(true); }, handleAddWidget };

  return (
    <InteractiveModeContext.Provider value={value}>
      <button onClick={handleToggleInteractiveMode} className={`fixed top-4 right-4 w-10 h-10 rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110 ${interactiveModeState ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-700/80 hover:bg-gray-600 text-white backdrop-blur-sm'}`} title={interactiveModeState ? 'Exit Settings' : 'Enter Settings'}>
        <Icon icon={interactiveModeState ? 'mdi:check' : 'mdi:cog'} className="text-xl" />
      </button>
      {interactiveModeState ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={e => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={horizontalListSortingStrategy}>
            <div className="interactive-mode relative">{children}</div>
          </SortableContext>
          <DragOverlay>{activeId ? <div className="opacity-80 bg-blue-500/20 border-2 border-blue-500 rounded-lg p-4">Dragging: {activeId}</div> : null}</DragOverlay>
          <button onClick={() => setAddModalOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110" title="Add Widget">
            <Icon icon="mdi:plus" className="text-2xl" />
          </button>
          {addModalOpen && <AddWidgetModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddWidget} />}
        </DndContext>
      ) : children}
    </InteractiveModeContext.Provider>
  );
}

export function useInteractiveMode() {
  const context = useContext(InteractiveModeContext);
  if (!context) throw new Error('useInteractiveMode must be used within InteractiveModeProvider');
  return context;
}
