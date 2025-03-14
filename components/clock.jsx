import { useEffect, useState } from 'react';

function _time(now, config){
    const appConf = config.apps.clock;
    var hours = now.getHours();
    const minutes =  ('0' + now.getMinutes()).slice(-2);
    var seconds = now.getSeconds();
    const ampm = hours >= 12 ? appConf.pm : appConf.am;
    var sep;
    if(appConf.pulse){
        sep = seconds % 2 === 0 ? appConf.separator : " ";
        sep = appConf.showSec ? appConf.separator : sep;
    }
    seconds = appConf.showSec ? ('0' + now.getSeconds()).slice(-2) : "";

    var greet;
    if (hours >= 6 && hours < 12){
        greet = `${appConf.greet.morning}${appConf.greet.name}`;
    }else if (hours >= 12 && hours < 18){
        greet = `${appConf.greet.afternoon}${appConf.greet.name}`;
    }else if (hours >= 18 && hours < 21){
        greet = `${appConf.greet.evening}${appConf.greet.name}`;
    }else{
        greet = `${appConf.greet.night}${appConf.greet.name}`;
    }

    if (appConf.format12){
        hours = hours % 12;
        hours = hours ? hours : 12;
    }
    
    if (!appConf.format12 || appConf.lead0){
        hours = ('0' + hours).slice(-2);
    }

    return {hours, minutes, seconds, ampm, sep, greet};
}

export default function Clock({config, isHidden, span}){
    const [now, setNow] = useState(new Date());
    const {hours, minutes, seconds, ampm, sep, greet} = _time(now, config);
    const timeString = `${hours}${sep}${minutes}${config.apps.clock.showSec ? sep : ""}${seconds} ${config.apps.clock.format12 ? ampm : ""}`;
    const theme = config.theme;

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    },[]);

    return (
        <div className={`md:flex ${isHidden? "hidden" : "flex"} flex-col py-8 items-center justify-center ${span ? "col-span-4" : ""}`}>
            <div className="flex-1 flex font-bold text-center items-center pb-4 leading-[1]" style={{fontSize: theme.text.size.primary, color: theme.text.color.fg}}>
                {timeString}
            </div>
            <div className="flex-shrink font-light text-center" style={{fontSize: theme.text.size.secondary, color: theme.text.color.fg}}>
                {greet}
            </div>
        </div>
    )
    
}