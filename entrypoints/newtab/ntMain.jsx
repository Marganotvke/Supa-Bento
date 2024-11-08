import React from "react";
import ReactDOM from 'react-dom/client';
import LayoutGenerator from "../../components/layoutGen.jsx";
import { CustomCONFIG } from '../../assets/customConfig.js'; 
import { DefaultCONFIG } from '../../assets/defaultConfig.js';
import imageUrl from '../../assets/background.jpg';

const config = CustomCONFIG.customActive ? CustomCONFIG : DefaultCONFIG;
const theme = config.theme;
const bg = {backgroundImage: [`linear-gradient(${theme.bgImg.bgCol.start}, ${theme.bgImg.bgCol.end})`, `url(${imageUrl})`]};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <div className={`h-screen w-screen bg-cover`} style={bg}>
            <LayoutGenerator config={config}/>
        </div>
    </React.StrictMode>,
);