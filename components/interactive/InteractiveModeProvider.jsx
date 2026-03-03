import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify-icon/react';
import Clock from '../../components/clock';
import Cardbox from '../../components/cards';
import ListBox from '../../components/lists';
import Memo from '../../components/memo';
import Dates from '../../components/date';
import Empty from '../../components/empty';
import Weather from '../../components/weather';
import useInteractiveModeStore from '../../hooks/useInteractiveMode';

// Widget controls component
function WidgetControls({ widgetType, index }) {
  const { handleDeleteWidget, handleOpenSettings } = useInteractiveMode();
  
  return (
    <>
      <button
        onClick={() => handleOpenSettings(index)}
        className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-500 text-white flex items-center justify-center"
        title="Widget Settings"
      >
        <Icon icon="mdi:cog" width="16" />
      </button>
      <button
        onClick={() => handleDeleteWidget(index)}
        className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center"
        title="Delete Widget"
      >
        <Icon icon="mdi:close" width="16" />
      </button>
    </>
  );
}

// Native HTML5 draggable widget for true swap
function DraggableWidget({ id, widgetType, index, renderWidget, onDragStart, onDragOver, onDrop, isDragging, isDropTarget }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver(index);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    const sourceIndex = parseInt(sourceId.split('-')[1], 10);
    onDrop(sourceIndex, index);
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative group min-h-[100px] ${isDragging ? 'opacity-30' : ''} ${isDropTarget ? 'ring-4 ring-blue-500 ring-offset-2 rounded-lg' : ''}`}
      style={{ cursor: 'grab' }}
    >
      {/* Drag handle indicator */}
      <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-6 h-6 rounded bg-gray-500/80 flex items-center justify-center text-white">
          <Icon icon="mdi:drag" width="14" />
        </div>
      </div>
      {/* Render widget */}
      {renderWidget(widgetType, index)}
      {/* Widget controls */}
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <WidgetControls widgetType={widgetType} index={index} />
      </div>
    </div>
  );
}

// Create context for interactive mode
const InteractiveModeContext = createContext(null);

// Modal components
function AddWidgetModal({ open, onClose, onAdd, config }) {
  if (!open) return null;
  
  const widgetTypes = [
    { id: 'clock', name: 'Clock', icon: 'mdi:clock-outline' },
    { id: 'clock2', name: 'Big Clock', icon: 'mdi:clock-outline' },
    { id: 'date', name: 'Date', icon: 'mdi:calendar' },
    { id: 'date2', name: 'Big Date', icon: 'mdi:calendar' },
    { id: 'weather', name: 'Weather', icon: 'mdi:weather-partly-cloudy' },
    { id: 'cardbox', name: 'Cards', icon: 'mdi:cards' },
    { id: 'listbox', name: 'Lists', icon: 'mdi:format-list-bulleted' },
    { id: 'memo', name: 'Memo', icon: 'mdi:note-text' },
  ];
  
  const maxCells = config.layout.cols * config.layout.rows;
  const currentCells = config.layout.items.length;
  const isFull = currentCells >= maxCells;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Add Widget</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <Icon icon="mdi:close" width="24" />
          </button>
        </div>
        {isFull ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            Grid is full. Remove a widget first.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {widgetTypes.map(widget => (
              <button
                key={widget.id}
                onClick={() => onAdd(widget.id)}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 flex flex-col items-center gap-2 transition-colors"
              >
                <Icon icon={widget.icon} width="32" className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm dark:text-white">{widget.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GridSettingsModal({ open, onClose, config, onSave }) {
  const [cols, setCols] = useState(config.layout.cols);
  const [rows, setRows] = useState(config.layout.rows);
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Grid Settings</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <Icon icon="mdi:close" width="24" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-white mb-2">Columns: {cols}</label>
            <input
              type="range"
              min="1"
              max="6"
              value={cols}
              onChange={e => setCols(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-white mb-2">Rows: {rows}</label>
            <input
              type="range"
              min="1"
              max="4"
              value={rows}
              onChange={e => setRows(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            onClick={() => onSave({ ...config, layout: { ...config.layout, cols, rows } })}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Provider Component
export default function InteractiveModeProvider({ config, onConfigUpdate, children }) {
  const { initialize, saveInteractiveMode } = useInteractiveModeStore();
  const [items, setItems] = useState(config.layout.items || []);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [gridModalOpen, setGridModalOpen] = useState(false);
  const [interactiveModeState, setInteractiveModeState] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    initialize();
    const unsubscribe = useInteractiveModeStore.subscribe(state => setInteractiveModeState(state.isInteractiveMode));
    setInteractiveModeState(useInteractiveModeStore.getState().isInteractiveMode);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (config?.layout?.items) {
      setItems(config.layout.items);
    }
  }, [config?.layout?.items]);

  // Handle native HTML5 drag end - true swap
  const handleDndKitDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const oldIndex = items.findIndex((item, idx) => getDraggableId(item, idx) === active.id);
    const newIndex = items.findIndex((item, idx) => getDraggableId(item, idx) === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const newItems = [...items];
      const [removed] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, removed);
      
      setItems(newItems);
      onConfigUpdate({ ...config, layout: { ...config.layout, items: newItems } });
    }
  };

  // Native HTML5 drag handlers for true swap
  const handleNativeDragStart = useCallback((index) => {
    setDragIndex(index);
  }, []);

  const handleNativeDragOver = useCallback((index) => {
    setHoverIndex(index);
  }, []);

  const handleNativeDrop = useCallback((sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex) return;
    
    // True swap: directly exchange the two items
    const newItems = [...items];
    const temp = newItems[sourceIndex];
    newItems[sourceIndex] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    
    setItems(newItems);
    onConfigUpdate({ ...config, layout: { ...config.layout, items: newItems } });
    setDragIndex(null);
    setHoverIndex(null);
  }, [items, config, onConfigUpdate]);

  const handleNativeDragEnd = useCallback(() => {
    setDragIndex(null);
    setHoverIndex(null);
  }, []);

  // Generate unique ID for draggable
  const getDraggableId = (item, index) => `widget-${index}-${item}`;

  const handleDeleteWidget = (widgetIndex) => {
    const newItems = items.filter((_, idx) => idx !== widgetIndex);
    setItems(newItems);
    onConfigUpdate({ ...config, layout: { ...config.layout, items: newItems } });
  };

  const handleAddWidget = (widgetType) => {
    const maxCells = config.layout.cols * config.layout.rows;
    const currentCells = config.layout.items.length;
    if (currentCells >= maxCells) return;
    
    const newItems = [...items, widgetType];
    setItems(newItems);
    onConfigUpdate({ ...config, layout: { ...config.layout, items: newItems } });
    setAddModalOpen(false);
  };

  const handleGridSave = (newConfig) => {
    const maxCells = newConfig.layout.cols * newConfig.layout.rows;
    let newItems = [...config.layout.items];
    if (newItems.length > maxCells) {
      newItems = newItems.slice(0, maxCells);
    }
    setItems(newItems);
    onConfigUpdate({ ...newConfig, layout: { ...newConfig.layout, items: newItems } });
  };

  const handleToggleInteractiveMode = () => saveInteractiveMode(!interactiveModeState);

  // Render widget based on type
  const renderWidget = (widgetType, index) => {
    const isHidden = index > config.layout.cols;
    const props = {
      config: config,
      isHidden: isHidden,
    };
    
    switch (widgetType) {
      case 'clock':
        return <Clock {...props} />;
      case 'clock2':
        return <Clock {...props} span />;
      case 'date':
        return <Dates {...props} />;
      case 'date2':
        return <Dates {...props} span />;
      case 'weather':
        return <Weather {...props} />;
      case 'cardbox':
        return <Cardbox {...props} idx={index} />;
      case 'listbox':
        return <ListBox {...props} idx={index} />;
      case 'memo':
        return <Memo {...props} idx={index} />;
      default:
        return <Empty {...props} />;
    }
  };

  const handleOpenSettings = (index) => {
    const widgetType = items[index];
    if (widgetType) {
      browser.runtime.openOptionsPage();
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

  // Render interactive mode with @hello-pangea/dnd
  if (interactiveModeState) {
    return (
      <InteractiveModeContext.Provider value={value}>
        {/* Toolbar */}
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

        {/* Interactive Grid with native HTML5 drag - true swap */}
        <div
          className="px-[5%] py-[5%] md:px-[10%] lg:px-[15%] xl:px-[20%] h-screen w-screen grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${config.layout.cols}, 1fr)`,
            gridTemplateRows: `repeat(${config.layout.rows}, 1fr)`,
          }}
          onDragEnd={handleNativeDragEnd}
        >
          {items.map((item, index) => (
            <DraggableWidget 
              key={getDraggableId(item, index)}
              id={getDraggableId(item, index)}
              widgetType={item}
              index={index}
              renderWidget={renderWidget}
              onDragStart={handleNativeDragStart}
              onDragOver={handleNativeDragOver}
              onDrop={handleNativeDrop}
              isDragging={dragIndex === index}
              isDropTarget={hoverIndex === index && dragIndex !== null && dragIndex !== index}
            />
          ))}
        </div>
        
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
      </InteractiveModeContext.Provider>
    );
  }

  // Non-interactive mode - just render children
  return (
    <InteractiveModeContext.Provider value={value}>
      {/* Enter Settings button */}
      <div className="fixed top-4 right-4 z-[9999] opacity-0 hover:opacity-100 transition-opacity duration-200">
        <button 
          onClick={handleToggleInteractiveMode} 
          className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-white transition-all hover:scale-110" 
          title="Enter Settings"
        >
          <Icon icon="mdi:cog" className="text-xl" />
        </button>
      </div>
      {children}
    </InteractiveModeContext.Provider>
  );
}

export function useInteractiveMode() {
  const context = useContext(InteractiveModeContext);
  if (!context) throw new Error('useInteractiveMode must be used within InteractiveModeProvider');
  return context;
}

export { WidgetControls };
