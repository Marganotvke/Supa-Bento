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

    const usrBgImg = storage.defineItem("local:userBgImage", {
        fallback: "https://picsum.photos/1920/1080",
        init: () => { return "https://picsum.photos/1920/1080" },
    })

    const config = await usrConfig.getValue();
    const theme = config.theme;
    const bgImg = !theme.bgImg.imgIsUrl || theme.bgImg.img === "" ? await usrBgImg.getValue() : theme.bgImg.img;

    const bg = {"backgroundSize": theme.bgImg.bgSize, backgroundImage: [`linear-gradient(${theme.bgImg.bgCol.deg}deg, ${theme.bgImg.bgCol.start}, ${theme.bgImg.bgCol.end})`, `${theme.bgImg.useCol ? '' : `url(${bgImg})`}`]};

    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <div className={`h-full w-full bg-[--themeBg]`} style={{ "--themeBg": theme.bg, ...bg }}>
                <LayoutGenerator config={config}/>
            </div>
        </React.StrictMode>,
    );
})();