import React, { createContext, useContext, useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, useSortable, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
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

const InteractiveModeContext = createContext(null);

// Widget Controls Component - exported for use in compGen.jsx
export function WidgetControls({ widgetType, index }) {
  const store = useInteractiveModeStore();
  const { handleDeleteWidget, handleOpenSettings } = store || {};
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasSettings = ['clock', 'clock2', 'date', 'date2', 'cardbox', 'listbox', 'memo', 'weather'].includes(widgetType);

  return (
    <>
      <div className="flex gap-1 bg-black/70 backdrop-blur-sm rounded-lg p-1">
        {hasSettings && (
          <button onClick={() => handleOpenSettings?.(index)} className="p-1 text-white hover:bg-blue-500/70 rounded" title="Settings">
            <Icon icon="mdi:cog" width="14" height="14" />
          </button>
        )}
        <button onClick={() => setShowDeleteConfirm(true)} className="p-1 text-white hover:bg-red-500/70 rounded" title="Delete Widget">
          <Icon icon="mdi:close" width="14" height="14" />
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

// Grid Settings Modal
function GridSettingsModal({ open, onClose, config, onSave }) {
  const [cols, setCols] = useState(config.layout.cols);
  const [rows, setRows] = useState(config.layout.rows);

  if (!open) return null;

  const handleSave = () => {
    onSave({ ...config, layout: { ...config.layout, cols, rows } });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ backgroundColor: '#1a1a1a', padding: '24px', borderRadius: '12px', maxWidth: '350px', width: '90%', color: 'white' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Grid Size</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px' }}><Icon icon="mdi:close" /></button>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '12px' }}>Columns</label>
            <select 
              value={cols} 
              onChange={(e) => setCols(parseInt(e.target.value))}
              style={{ width: '100%', padding: '10px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '12px' }}>Rows</label>
            <select 
              value={rows} 
              onChange={(e) => setRows(parseInt(e.target.value))}
              style={{ width: '100%', padding: '10px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
        </div>
        
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>
          Maximum cells: {cols * rows}. Current widgets: {config.layout.items.length}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #444', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// Add Widget Modal
function AddWidgetModal({ open, onClose, onAdd, config }) {
  if (!open) return null;

  const maxCells = config.layout.cols * config.layout.rows;
  const currentCells = config.layout.items.length;
  const isFull = currentCells >= maxCells;

  const handleAdd = (widgetType) => {
    if (isFull) return;
    onAdd(widgetType);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ backgroundColor: '#1a1a1a', padding: '24px', borderRadius: '12px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto', color: 'white' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Add Widget</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px' }}><Icon icon="mdi:close" /></button>
        </div>
        
        {isFull && (
          <div style={{ backgroundColor: '#7f1d1d', padding: '12px', borderRadius: '8px', marginBottom: '16px', color: '#fca5a5' }}>
            Grid is full ({currentCells}/{maxCells} cells). Remove a widget or increase grid size first.
          </div>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
          {WIDGET_TYPES.map(widget => (
            <div 
              key={widget.type} 
              onClick={() => handleAdd(widget.type)} 
              style={{ 
                backgroundColor: isFull ? '#1a1a1a' : '#2a2a2a', 
                padding: '16px', 
                borderRadius: '8px', 
                cursor: isFull ? 'not-allowed' : 'pointer', 
                border: '1px solid #333', 
                transition: 'all 0.2s',
                opacity: isFull ? 0.5 : 1,
              }}
              onMouseEnter={e => { if (!isFull) { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-2px)'; }}}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
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
  const [gridModalOpen, setGridModalOpen] = useState(false);
  const [interactiveModeState, setInteractiveModeState] = useState(false);

  useEffect(() => {
    initialize();
    const unsubscribe = useInteractiveModeStore.subscribe(state => setInteractiveModeState(state.isInteractiveMode));
    setInteractiveModeState(useInteractiveModeStore.getState().isInteractiveMode);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (config?.layout?.items) {
      // Create unique IDs for each widget
      const uniqueItems = config.layout.items.map((item, idx) => `${item}-${idx}`);
      setItems(uniqueItems);
    }
  }, [config?.layout?.items]);

  // Disable transition during drag for instant swap feel
  useEffect(() => {
    if (activeId) {
      document.body.style.setProperty('--dnd-transition', 'none');
    } else {
      document.body.style.setProperty('--dnd-transition', 'transform 0.2s ease');
    }
  }, [activeId]);

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
        // Use swap instead of arrayMove for direct swap behavior
        const newItems = [...items];
        [newItems[oldIndex], newItems[newIndex]] = [newItems[newIndex], newItems[oldIndex]];
        setItems(newItems);
        // Extract widget types (before the last dash and number) and save
        const widgetTypes = newItems.map(item => item.replace(/-[0-9]+$/, ''));
        onConfigUpdate({ ...config, layout: { ...config.layout, items: widgetTypes } });
      }
    }
  };

  const handleDeleteWidget = (widgetIndex) => {
    const newItems = items.filter((_, idx) => idx !== widgetIndex);
    setItems(newItems);
    // Extract widget types and save
    const widgetTypes = newItems.map(item => item.replace(/-[0-9]+$/, ''));
    onConfigUpdate({ ...config, layout: { ...config.layout, items: widgetTypes } });
  };

  const handleAddWidget = (widgetType) => {
    const maxCells = config.layout.cols * config.layout.rows;
    const currentCells = config.layout.items.length;
    if (currentCells >= maxCells) return;
    
    // Create unique ID for the new widget
    const uniqueId = `${widgetType}-${items.length}`;
    const newItems = [...items, uniqueId];
    setItems(newItems);
    // Save widget types to config
    const widgetTypes = newItems.map(item => item.replace(/-[0-9]+$/, ''));
    onConfigUpdate({ ...config, layout: { ...config.layout, items: widgetTypes } });
    setAddModalOpen(false);
  };

  const handleGridSave = (newConfig) => {
    const maxCells = newConfig.layout.cols * newConfig.layout.rows;
    let newItems = [...config.layout.items];
    if (newItems.length > maxCells) {
      newItems = newItems.slice(0, maxCells);
    }
    const updatedConfig = { ...newConfig, layout: { ...newConfig.layout, items: newItems } };
    setItems(newItems);
    onConfigUpdate(updatedConfig);
  };

  const handleToggleInteractiveMode = () => saveInteractiveMode(!interactiveModeState);

  const handleOpenSettings = (index) => {
    // Open the options page with the widget type as a hash/parameter
    const widgetType = items[index];
    if (widgetType) {
      // Open options page with the widget type
      browser.runtime.openOptionsPage();
      // Send a message to the options page to navigate to the specific widget
      setTimeout(() => {
        browser.runtime.sendMessage({ 
          action: 'openWidgetSettings', 
          widgetType: widgetType 
        });
      }, 500);
    }
  };

  const value = { 
    isInteractiveMode: interactiveModeState, 
    handleDeleteWidget, 
    handleOpenSettings,
    handleAddWidget 
  };

  return (
    <InteractiveModeContext.Provider value={value}>
      {/* Toolbar - only visible in interactive mode */}
      {interactiveModeState && (
        <div className="fixed top-4 right-4 z-[9999] flex gap-2">
          <button 
            onClick={() => setGridModalOpen(true)} 
            className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-110" 
            title="Grid Settings"
          >
            <Icon icon="mdi:grid" className="text-xl" />
          </button>
          <button 
            onClick={handleToggleInteractiveMode} 
            className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-110" 
            title="Exit Settings"
          >
            <Icon icon="mdi:check" className="text-xl" />
          </button>
        </div>
      )}

      {/* Enter Settings button - only visible on hover when NOT in interactive mode */}
      {!interactiveModeState && (
        <div className="fixed top-4 right-4 z-[9999] opacity-0 hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={handleToggleInteractiveMode} 
            className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-white transition-all hover:scale-110" 
            title="Enter Settings"
          >
            <Icon icon="mdi:cog" className="text-xl" />
          </button>
        </div>
      )}

      {interactiveModeState ? (
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragStart={e => setActiveId(e.active.id)} 
          onDragEnd={handleDragEnd}
          modifiers={[]}
        >
          <SortableContext items={items} strategy={rectSortingStrategy}>
            <div className="interactive-mode relative">{children}</div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <div className="opacity-90 bg-blue-600/80 border-2 border-white rounded-lg p-4 text-white font-medium shadow-xl">
                {activeId}
              </div>
            ) : null}
          </DragOverlay>
          
          {/* Add Widget Button */}
          <button 
            onClick={() => setAddModalOpen(true)} 
            className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110" 
            title="Add Widget"
          >
            <Icon icon="mdi:plus" className="text-2xl" />
          </button>
          
          <AddWidgetModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddWidget} config={config} />
          <GridSettingsModal open={gridModalOpen} onClose={() => setGridModalOpen(false)} config={config} onSave={handleGridSave} />
        </DndContext>
      ) : (
        <>{children}</>
      )}
    </InteractiveModeContext.Provider>
  );
}

export function useInteractiveMode() {
  const context = useContext(InteractiveModeContext);
  if (!context) throw new Error('useInteractiveMode must be used within InteractiveModeProvider');
  return context;
}
