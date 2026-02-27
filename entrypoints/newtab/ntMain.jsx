import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import LayoutGenerator from "../../components/layoutGen.jsx";
import { DefaultCONFIG } from '../../assets/defaultConfig.js';
import { InteractiveModeProvider } from '../../components/interactive/index.js';
import { storage } from "#imports";
import useInteractiveModeStore from '../../hooks/useInteractiveMode';

function App() {
    const [config, setConfig] = useState(null);
    const [bgImg, setBgImg] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { saveInteractiveMode } = useInteractiveModeStore;

    // Handle messages from popup/options
    useEffect(() => {
        const handleMessage = async (message) => {
            if (message.action === 'enterInteractiveMode') {
                await saveInteractiveMode(true);
                // Force re-render by updating state
                window.location.reload();
            }
        };

        browser.runtime.onMessage.addListener(handleMessage);
        
        return () => {
            browser.runtime.onMessage.removeListener(handleMessage);
        };
    }, [saveInteractiveMode]);

    useEffect(() => {
        // Load configuration on mount
        const loadConfig = async () => {
            const usrConfig = storage.defineItem(
                "sync:usrConfig",
                {
                    fallback: DefaultCONFIG,
                }
            );

            const usrBgImg = storage.defineItem("local:userBgImage", {
                fallback: "https://picsum.photos/1920/1080",
                init: () => { return "https://picsum.photos/1920/1080" },
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
                setConfig(DefaultCONFIG);
                setBgImg(DefaultCONFIG.theme.bgImg.img);
            } finally {
                setIsLoading(false);
            }
        };

        loadConfig();
    }, []);

    // Handle config updates from interactive mode
    const handleConfigUpdate = async (newConfig) => {
        setConfig(newConfig);
        
        // Persist to storage
        try {
            const usrConfig = storage.defineItem("sync:usrConfig", {
                fallback: DefaultCONFIG,
            });
            await usrConfig.setValue(newConfig);
        } catch (error) {
            console.error('Failed to save config:', error);
        }
    };

    if (isLoading || !config) {
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

    return (
        <InteractiveModeProvider 
            config={config} 
            onConfigUpdate={handleConfigUpdate}
        >
            <div 
                className={`h-full w-full bg-[--themeBg]`} 
                style={{ "--themeBg": theme.bg, ...bg }}
            >
                <LayoutGenerator config={config}/>
            </div>
        </InteractiveModeProvider>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
