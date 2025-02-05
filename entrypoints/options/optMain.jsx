import React from "react";
import ReactDOM from 'react-dom/client';
import Options from './opt.jsx';
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import '@mantine/carousel/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MantineProvider>
            <Options />
        </MantineProvider>
    </React.StrictMode>,
);