import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Clock from "./clock";
import Cardbox from "./cards";
import ListBox from "./lists";
import Memo from "./memo";
import Dates from "./date";
import Empty from "./empty";
import Weather from "./weather";
import useInteractiveModeStore from '../hooks/useInteractiveMode';

// Sortable wrapper for widgets
function SortableWidget({ children, widgetType, index, isInteractiveMode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widgetType });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, position: 'relative', height: '100%' };

  if (!isInteractiveMode) return children;

  return (
    <div ref={setNodeRef} style={style} className="interactive-widget relative group">
      <div {...attributes} {...listeners} className="absolute inset-0 z-10 cursor-move" title="Drag to reorder" />
      <div className="h-full w-full">{children}</div>
      <div className="absolute bottom-2 left-2 z-20 opacity-0 group-hover:opacity-50 transition-opacity">
        <span className="text-white text-sm">☰</span>
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
        
        // Wrap with sortable in interactive mode
        if (isInteractiveMode) {
          return (
            <SortableWidget key={`${comp}-${i}`} widgetType={comp} index={i} isInteractiveMode={isInteractiveMode}>
              {widget}
            </SortableWidget>
          );
        }
        
        return widget;
      })}
    </>
  );
}
