import { useState, useEffect } from 'react';
import { Icon } from '@iconify-icon/react';
import Clock from "./clock";
import Cardbox from "./cards";
import ListBox from "./lists";
import Memo from "./memo";
import Dates from "./date";
import Empty from "./empty";
import Weather from "./weather";
import useInteractiveModeStore from '../hooks/useInteractiveMode';

// Widget controls - inline for better performance
function WidgetControls({ widgetType, index }) {
  const handleOpenSettings = () => {
    browser.runtime.openOptionsPage();
    setTimeout(() => {
      browser.runtime.sendMessage({ 
        action: 'openWidgetSettings', 
        widgetType: widgetType 
      });
    }, 500);
  };
  
  const handleDeleteWidget = async () => {
    // This functionality is only available in interactive mode
    // For normal mode, we'll redirect to settings
    handleOpenSettings();
  };
  
  return (
    <>
      <button
        onClick={handleOpenSettings}
        className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-500 text-white flex items-center justify-center"
        title="Widget Settings"
      >
        <Icon icon="mdi:cog" width="16" />
      </button>
    </>
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
        
        // In interactive mode, wrap with widget controls
        if (isInteractiveMode) {
          return (
            <div key={i} className="relative group h-full">
              {/* Widget */}
              <div className="h-full w-full">{widget}</div>
              {/* Controls overlay */}
              <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <WidgetControls widgetType={comp} index={i} />
              </div>
            </div>
          );
        }
        
        return widget;
      })}
    </>
  );
}
