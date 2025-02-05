import React from "react";
import ReactDOM from 'react-dom/client';
import LayoutGenerator from "../../components/layoutGen.jsx";
import { DefaultCONFIG } from '../../assets/defaultConfig.js';
import imageUrl from '../../assets/background.jpg';
import { storage } from "wxt/storage";

const usrConfig = storage.defineItem(
    "sync:usrConfig",
    {
        fallback: DefaultCONFIG,
    }
);

const config = await usrConfig.getValue();
const theme = config.theme;
const bg = {backgroundImage: [`linear-gradient(${theme.bgImg.bgCol.start}, ${theme.bgImg.bgCol.end})`, `url(${imageUrl})`]};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <div className={`h-full w-full bg-cover`} style={bg}>
            <LayoutGenerator config={config}/>
        </div>
    </React.StrictMode>,
);