import { useState, useEffect, useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@iconify-icon/react';
import Clock from "./clock";
import Cardbox from "./cards";
import ListBox from "./lists";
import Memo from "./memo";
import Dates from "./date";
import Empty from "./empty";
import Weather from "./weather";
import useInteractiveModeStore from '../hooks/useInteractiveMode';
import { useInteractiveMode, WidgetControls } from './interactive/index.js';

// Sortable wrapper for widgets
function SortableWidget({ children, widgetType, widgetId, index, isInteractiveMode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widgetId });
  const style = { transform: CSS.Transform.toString(transform), transition: 'var(--dnd-transition, transform 0.2s ease)', opacity: isDragging ? 0.5 : 1, position: 'relative', height: '100%' };

  if (!isInteractiveMode) return children;

  return (
    <div ref={setNodeRef} style={style} className="interactive-widget relative group">
      <div {...attributes} {...listeners} className="absolute inset-0 z-10 cursor-move flex items-center justify-center" title="Drag to reorder">
        <div className="bg-black/70 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
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
        
        // Wrap with sortable in interactive mode
        if (isInteractiveMode) {
          return (
            <SortableWidget key={`${comp}-${i}`} widgetId={`${comp}-${i}`} widgetType={comp} index={i} isInteractiveMode={isInteractiveMode}>
              {widget}
            </SortableWidget>
          );
        }
        
        return widget;
      })}
    </>
  );
}
