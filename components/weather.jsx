import {useEffect, useState, useRef} from 'react';
import { Icon } from "@iconify-icon/react";
import { storage } from "#imports";

function _decodeWeather(prov, res){
    const weatherCodeDecode = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light intensity drizzle",
        53: "Moderate intensity drizzle",
        55: "Dense intensity drizzle",
        56: "Light intensity freezing drizzle",
        57: "Dense intensity freezing drizzle",
        61: "Slight intensity rain",
        63: "Moderate intensity rain",
        65: "Heavy intensity rain",
        66: "Light intensity freezing rain",
        67: "Heavy intensity freezing rain",
        71: "Slight intensity snow fall",
        73: "Moderate intensity snow fall",
        75: "Heavy intensity snow fall",
        77: "Snow grains",
        80: "Slight intensity rain showers",
        81: "Moderate intensity rain showers",
        82: "Violent intensity rain showers",
        85: "Slight intensity snow showers",
        86: "Heavy intensity snow showers",
        95: "Slight or moderate thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    };

    const code2icon = {
        0: ["material-symbols:sunny-outline-rounded", "bi:moon-stars"],
        1: ["material-symbols:sunny-outline-rounded", "bi:moon-stars"],
        2: ["wi:day-cloudy", "wi:night-alt-cloudy"],
        3: ["fluent:weather-cloudy-24-regular", "fluent:weather-cloudy-24-regular"],
        45: ["tdesign:fog-sunny", "tdesign:fog-night"],
        48: ["tdesign:fog","tdesign:fog"],
        51: ["uil:cloud-sun-rain", "uil:cloud-moon-rain"],
        53: ["uil:cloud-sun-rain", "uil:cloud-moon-rain"],
        55: ["uil:cloud-drizzle", "uil:cloud-drizzle"],
        56: ["fluent:weather-rain-snow-20-regular", "fluent:weather-rain-snow-20-regular"],
        57: ["fluent:weather-rain-snow-20-regular", "fluent:weather-rain-snow-20-regular"],
        61: ["carbon:rain-scattered", "carbon:rain-scattered-night"],
        63: ["f7:cloud-sun-rain", "f7:cloud-moon-rain"],
        65: ["f7:cloud-rain", "f7:cloud-rain"],
        66: ["fluent:weather-rain-snow-20-regular", "fluent:weather-rain-snow-20-regular"],
        67: ["fluent:weather-rain-snow-20-regular", "fluent:weather-rain-snow-20-regular"],
        71: ["fontisto:day-snow", "fontisto:night-snow"],
        73: ["fontisto:snow", "fontisto:snow"],
        75: ["mdi:snowflake-alert", "mdi:snowflake-alert"],
        77: ["material-symbols:rainy-snow", "material-symbols:rainy-snow"],
        80: ["carbon:rain-scattered", "carbon:rain-scattered-night"],
        81: ["f7:cloud-sun-rain", "f7:cloud-moon-rain"],
        82: ["f7:cloud-rain", "f7:cloud-rain"],
        85: ["fontisto:day-snow", "fontisto:night-snow"],
        86: ["mdi:snowflake-alert", "mdi:snowflake-alert"],
        95: ["wi:day-thunderstorm", "wi:night-alt-thunderstorm"],
        96: ["wi:day-hail", "wi:night-alt-hail"],
        99: ["carbon:hail", "carbon:hail"]
    }

    var cur, fetchTime, temperature, apparent_temperature, alert, weather, weatherIcon;

    if(prov === "o"){
        cur = res.current;
        fetchTime = cur.time;
        temperature = cur.temperature_2m;
        apparent_temperature = cur.apparent_temperature;
        alert = "This source does not support alert!";
        weather = weatherCodeDecode[cur.weather_code];
        weatherIcon = (code2icon[cur.weather_code])[cur.is_day ? 0 : 1];
    }else{
        cur = res.currently;
        fetchTime = cur.time;
        temperature = cur.temperature;
        apparent_temperature = cur.apparentTemperature;
        alert = res.alerts ? res.alerts[0].title : "Currently no alerts";
        weather = cur.summary;
        weatherIcon = `meteocons:${cur.icon}`;
    }

        return {
        fetchTime: fetchTime * 1000,
        temperature,
        apparent_temperature,
        weather,
        weatherIcon,
        alert
    };
}

function _weatherItem(i, weather, f, item){
    switch(item){
        case "feelsLike":
            return <div key={i}>Feels like {weather.apparent_temperature}°{f ? "F" : "C"}</div>;
        case "alert":
            return <div className="text-wrap" key={i}>{weather.alert}</div>;
        case "weather":
            return <div key={i}>{weather.weather}</div>;
        default:
            return null;
    }
}

export default function Weather({ config, isHidden, span}){
    const [show, setShow] = useState(false);

    const nowUnix = Date.now();

    const theme = config.theme;
    const anim = theme.animation.active ? {transition: `${theme.animation.duration}ms ease-in-out`} : {transition: `none`};
    const appsConfig = config.apps.weather;
    const [prov, lat, lon, f, showIcon, apiKey] = [appsConfig.provider, appsConfig.lat, appsConfig.lon, appsConfig.f, appsConfig.showIcon, appsConfig.apiKey];
    const items = appsConfig.items;
    const [weather, setWeather] = useState({ fetchTime: 0, temperature: "-", apparent_temperature: "-", weather: "", alert: "", weatherIcon: ""});
    const iconRef = useRef(null);

    const restartIcon = () =>{
        if (iconRef.current) {
            iconRef.current.restartAnimation();
        }
    }
    
    const api = prov === "o" ? `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,is_day,weather_code${f ? "&temperature_unit=fahrenheit" : ""}&timeformat=unixtime&timezone=auto&models=${'best_match'}` : `https://api.pirateweather.net/forecast/${apiKey}/${lat},${lon}?exclude=minutely%2Chourly%2Cdaily&units=${f ? "us" : "si"}`;
    
    useEffect(() => {
        const fetchError = (err) => {
            setWeather({ fetchTime: 0, temperature: '-', apparent_temperature: '-', weather: "Error fetching weather data", alert: "Error fetching weather data" });
            console.log("Error fetching weather data:", err);
        }

        const fetchWeatherData = async () => {
            const data = await fetch(api).catch((err) => { fetchError(err); return; });
            if (!data || !data.ok) {
                fetchError("Failed to fetch from API");
                return;
            }
            const res = await data.json();
            const decodedWeather = _decodeWeather(prov, res);
            setWeather(decodedWeather);
            await storage.setItem("local:weather", { ...decodedWeather, provider: prov });
        };
        
        const fetchFromStorage = async () => {
            await storage.getItem("local:weather").then((res) => {
                if (res && ((nowUnix - res.fetchTime) < 1000 * 60 * config.apps.weather.interval && res.provider === prov)) {
                    console.log("Weather data is up to date");
                    setWeather(res);
                } else {
                    fetchWeatherData();
                    console.log("Weather data is outdated, fetching new data");
                }
            });
        }

        fetchFromStorage();
    }, []);

    const handleMouseEnter = () =>{
        restartIcon();
        setShow(true);
    }

    const handleMouseLeave = () => {
        setShow(false);
    }

    return (
        <div className={`md:flex ${isHidden ? "hidden" : "flex"} flex-col ${ items.length < 2 ? "py-8" : "py-4"} gap-2 items-center justify-center ${span ? "col-span-4" : ""}`}>
            {!items.includes("weather") ? <span className={`${show ? "visible opacity-100" : "invisible opacity-0"} rounded px-1 tooltip bg-[--tooltipBg] font-light`} style={{ fontSize: theme.text.size.secondary, color: theme.text.color.fg, "--tooltipBg": theme.app, ...anim }}>{weather.weather}</span> : null}
            <div className="flex-1 flex font-bold text-center items-center leading-[1]" style={{fontSize: theme.text.size.primary, color: theme.text.color.fg}}>
                {showIcon ? <Icon ref={iconRef} icon={`${weather.weatherIcon}`} height="1.5em" style={{color: theme.accent}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} inline className="p-1"/> : null}
                {`${weather.temperature}°${f ? "F" : "C"}`}
            </div>
            <div className="flex-shrink flex-col gap-2 font-light text-center" style={{ fontSize: theme.text.size.secondary, color: theme.text.color.fg }}>
                {items.map((item, i)=>_weatherItem(i, weather, f, item))}
            </div>
        </div>
    )
}