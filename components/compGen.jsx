import { useState, useEffect, useContext } from 'react';
import { Icon } from '@iconify-icon/react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import Clock from "./clock";
import Cardbox from "./cards";
import ListBox from "./lists";
import Memo from "./memo";
import Dates from "./date";
import Empty from "./empty";
import Weather from "./weather";
import useInteractiveModeStore from '../hooks/useInteractiveMode';
import { WidgetControls } from './interactive/index.js';

// Interactive widget wrapper - adds settings/delete controls with dnd-kit draggable + droppable
function InteractiveWidgetWrapper({ children, widgetType, index, id }) {
  const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = useDraggable({ 
    id, 
    handle: '.drag-handle' 
  });
  
  // Also make each widget a droppable so we can detect which one we're hovering over
  const { setNodeRef: setDroppableRef } = useDroppable({ 
    id 
  });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 9999 : 'auto',
  };

  return (
    <div ref={setDroppableRef} style={style} className={`interactive-widget relative group h-full ${isDragging ? 'cursor-grabbing' : ''}`}>
      {/* Drag handle - only this element triggers drag */}
      <div 
        ref={setDraggableRef}
        className="drag-handle absolute inset-0 z-10 flex items-center justify-center cursor-grab" 
        title="Drag to reorder"
        {...listeners}
        {...attributes}
      >
        <div className="bg-black/70 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Icon icon="mdi:drag" width="24" height="24" />
        </div>
      </div>
      <div className="h-full w-full">{children}</div>
      {/* Settings and Delete icons - show on hover */}
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <WidgetControls widgetType={widgetType} index={index} />
      </div>
    </div>
  );
}

export default function ComponentGenerator({ config }) {
  const components = config.layout.items;
  const [isInteractiveMode, setIsInteractiveMode] = useState(false);
  
  useEffect(() => {
    const unsubscribe = useInteractiveModeStore.subscribe((state) => {
      setIsInteractiveMode(state.isInteractiveMode);
    });
    setIsInteractiveMode(useInteractiveModeStore.getState().isInteractiveMode);
    return unsubscribe;
  }, []);
  
  var cardCounts = 0;
  var listCounts = 0;
  var memoCounts = 0;
  const thresh = Math.ceil(config.layout.cols / 2);

  return (
    <>
      {components.map((comp, i) => {
        const isHidden = i > thresh;
        if (i >= config.layout.cols * config.layout.rows) return;
        
        let widget;
        switch (comp) {
          case "clock":
            widget = <Clock key={i} config={config} isHidden={isHidden} />;
            break;
          case "clock2":
            widget = <Clock key={i} config={config} isHidden={isHidden} span />;
            break;
          case "cardbox":
            widget = <Cardbox key={i} idx={cardCounts++} config={config} isHidden={isHidden} />;
            break;
          case "listbox":
            widget = <ListBox key={i} idx={listCounts++} config={config} isHidden={isHidden} />;
            break;
          case "memo":
            widget = <Memo key={i} idx={memoCounts++} config={config} isHidden={isHidden} />;
            break;
          case "date":
            widget = <Dates key={i} config={config} isHidden={isHidden} />;
            break;
          case "date2":
            widget = <Dates key={i} config={config} isHidden={isHidden} span />;
            break;
          case "weather":
            widget = <Weather key={i} config={config} isHidden={isHidden} />;
            break;
          default:
            widget = <Empty key={i} isHidden={isHidden} />;
        }
        
        // Wrap with interactive controls in interactive mode
        if (isInteractiveMode) {
          return (
            <InteractiveWidgetWrapper key={i} id={comp} widgetType={comp} index={i}>
              {widget}
            </InteractiveWidgetWrapper>
          );
        }
        
        return widget;
      })}
    </>
  );
}
