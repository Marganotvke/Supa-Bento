import { useEffect, useState } from 'react';

function _time(now, config){
    var hours = now.getHours();
    const minutes =  ('0' + now.getMinutes()).slice(-2);
    var seconds = now.getSeconds();
    const ampm = hours >= 12 ? config.apps.clock.pm : config.apps.clock.am;
    var sep;
    if(config.apps.clock.pulse){
        sep = seconds % 2 === 0 ? config.apps.clock.separator : " ";
        sep = config.apps.clock.showSec ? config.apps.clock.separator : sep;
    }
    seconds = config.apps.clock.showSec ? ('0' + now.getSeconds()).slice(-2) : "";

    var greet;
    if (hours >= 6 && hours < 12){
        greet = `${config.apps.clock.greet.morning}${config.apps.clock.greet.name}`;
    }else if (hours >= 12 && hours < 18){
        greet = `${config.apps.clock.greet.afternoon}${config.apps.clock.greet.name}`;
    }else if (hours >= 18 && hours < 22){
        greet = `${config.apps.clock.greet.evening}${config.apps.clock.greet.name}`;
    }else{
        greet = `${config.apps.clock.greet.night}${config.apps.clock.greet.name}`;
    }

    if (config.apps.clock.format === 12){
        hours = hours % 12;
        hours = hours ? hours : 12;
    }else{
        hours = ('0' + hours).slice(-2);
    }

    return {hours, minutes, seconds, ampm, sep, greet};
}

export default function Clock({config, isHidden}){
    const [now, setNow] = useState(new Date());
    const {hours, minutes, seconds, ampm, sep, greet} = _time(now, config);
    const timeString = `${hours}${sep}${minutes}${config.apps.clock.showSec ? sep : ""}${seconds} ${config.apps.clock.format === 12 ? ampm : ""}`;
    const theme = config.theme;

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    },[]);

    return (
        <div className={`md:flex ${isHidden? "hidden" : "flex"} flex-col py-8 items-center justify-center`}>
            <div className="flex-1 flex font-bold text-center items-center pb-4 leading-[1]" style={{fontSize: theme.text.size.primary, color: theme.text.color.fg}}>
                {timeString}
            </div>
            <div className="flex-shrink font-light text-center" style={{fontSize: theme.text.size.secondary, color: theme.text.color.fg}}>
                {greet}
            </div>
        </div>
    )
    
}