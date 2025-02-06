import React from "react";
import ReactDOM from 'react-dom/client';
import LayoutGenerator from "../../components/layoutGen.jsx";
import { DefaultCONFIG } from '../../assets/defaultConfig.js';
import { storage } from "wxt/storage";

(async () => { //IIFE
    const usrConfig = storage.defineItem(
        "sync:usrConfig",
        {
            fallback: DefaultCONFIG,
        }
    );

    const config = await usrConfig.getValue();
    const theme = config.theme;;
    const bg = {"backgroundSize": theme.bgImg.bgSize, backgroundImage: [`linear-gradient(${theme.bgImg.bgCol.deg}deg, ${theme.bgImg.bgCol.start}, ${theme.bgImg.bgCol.end})`, `url(${theme.bgImg.img})`]};

    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <div className={`h-full w-full`} style={bg}>
                <LayoutGenerator config={config}/>
            </div>
        </React.StrictMode>,
    );
})();