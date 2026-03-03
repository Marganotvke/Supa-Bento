import React, { useState, useEffect, lazy, Suspense } from "react";
import ReactDOM from 'react-dom/client';
import LayoutGenerator from "../../components/layoutGen.jsx";
import { DefaultCONFIG } from '../../assets/defaultConfig.js';
import { storage } from "#imports";
import { Icon } from '@iconify-icon/react';

// Lazy load interactive mode provider - only needed when entering settings mode
const InteractiveModeProvider = lazy(() => import('../../components/interactive/index.js').then(module => ({ default: module.InteractiveModeProvider })));

function App() {
    const [config, setConfig] = useState(DefaultCONFIG);
    const [bgImg, setBgImg] = useState(DefaultCONFIG.theme.bgImg.img);
    const [isLoading, setIsLoading] = useState(true);
    const [interactiveMode, setInteractiveMode] = useState(false);

    useEffect(() => {
        // Load configuration on mount
        const loadConfig = async () => {
            const usrConfig = storage.defineItem(
                "sync:usrConfig",
                { fallback: DefaultCONFIG }
            );

            const usrBgImg = storage.defineItem("local:userBgImage", {
                fallback: "https://picsum.photos/1920/1080",
                init: () => "https://picsum.photos/1920/1080",
            });

            try {
                const fetchedConfig = await usrConfig.getValue();
                const fetchedBgImg = !fetchedConfig.theme.bgImg.imgIsUrl || fetchedConfig.theme.bgImg.img === "" 
                    ? await usrBgImg.getValue() 
                    : fetchedConfig.theme.bgImg.img;
                
                setConfig(fetchedConfig);
                setBgImg(fetchedBgImg);
            } catch (error) {
                console.error('Failed to load config:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadConfig();
    }, []);

    // Handle config updates
    const handleConfigUpdate = async (newConfig) => {
        setConfig(newConfig);
        
        try {
            const usrConfig = storage.defineItem("sync:usrConfig", {
                fallback: DefaultCONFIG,
            });
            await usrConfig.setValue(newConfig);
        } catch (error) {
            console.error('Failed to save config:', error);
        }
    };

    // Enter/exit interactive mode
    const toggleInteractiveMode = () => setInteractiveMode(!interactiveMode);

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-[#19171a]">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    const theme = config.theme;
    const bg = {
        "backgroundSize": theme.bgImg.bgSize, 
        backgroundImage: [
            `linear-gradient(${theme.bgImg.bgCol.deg}deg, ${theme.bgImg.bgCol.start}, ${theme.bgImg.bgCol.end})`, 
            `${theme.bgImg.useCol ? '' : `url(${bgImg})`}`
        ]
    };

    // Render interactive mode with lazy loading
    if (interactiveMode) {
        return (
            <Suspense fallback={
                <div className="h-screen w-screen flex items-center justify-center bg-[#19171a]">
                    <div className="text-white text-lg">Loading...</div>
                </div>
            }>
                <InteractiveModeProvider 
                    config={config} 
                    onConfigUpdate={handleConfigUpdate}
                    onExitInteractiveMode={toggleInteractiveMode}
                >
                    <div 
                        className={`h-full w-full bg-[--themeBg]`} 
                        style={{ "--themeBg": theme.bg, ...bg }}
                    >
                        <LayoutGenerator config={config}/>
                    </div>
                </InteractiveModeProvider>
            </Suspense>
        );
    }

    // Normal mode with settings button
    return (
        <div 
            className={`h-full w-full bg-[--themeBg]`} 
            style={{ "--themeBg": theme.bg, ...bg }}
        >
            {/* Settings button */}
            <div className="fixed top-4 right-4 z-[9999]">
                <button 
                    onClick={toggleInteractiveMode} 
                    className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-white transition-all hover:scale-110" 
                    title="Enter Settings"
                >
                    <Icon icon="mdi:cog" className="text-xl" />
                </button>
            </div>
            <LayoutGenerator config={config}/>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
