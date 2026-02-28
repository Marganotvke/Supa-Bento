import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import Options from './opt.jsx';
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import '@mantine/carousel/styles.css';

function App() {
  const [widgetToOpen, setWidgetToOpen] = useState(null);

  useEffect(() => {
    const handleMessage = (message) => {
      if (message.action === 'openWidgetSettings') {
        setWidgetToOpen(message.widgetType);
      }
    };

    browser.runtime.onMessage.addListener(handleMessage);
    
    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <MantineProvider defaultColorScheme="dark">
      <Options widgetToOpen={widgetToOpen} />
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);