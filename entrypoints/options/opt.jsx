import { useEffect, useState } from "react";
import {DefaultCONFIG} from '../../assets/defaultConfig'
import {storage} from "wxt/storage";
import { AngleSlider, ColorInput, FileInput, Image, NumberInput, Select, Slider, Switch, Text, TextInput, Tabs, Button, ActionIcon } from "@mantine/core";
import { Icon } from '@iconify/react';

function _arrLenCh(arr, len){
    //helper function to change array length
    const arrLen = arr.length;
    var tmpArr = [...arr];
    if(arrLen < len) {
        tmpArr.length = len;
        tmpArr = tmpArr.fill("clock", arrLen);
    }
    return tmpArr;
}

export default function Options() {
    //see default config
    //layout
    const [cols, setCols] = useState(2);
    const [rows, setRows] = useState(2);
    const [gap, setGap] = useState(1);
    const [items, setItems] = useState(["clock","cardbox","memo","listbox"]);

    //theme
    const [accent, setAccent] = useState("#57a0d9");
    const [app, setApp] = useState("#201e21");
    const [text, setText] = useState({
            font: null,
            size: {
                primary: "11vh",
                secondary: "4vh",
                date: "8vh",
                itemText: "2vh"
            },
            color: {
                fg: "#d8dee9",
                sfg: "#2c292e"
            }
        });
    const [icon, setIcon] = useState({size: "3vh"});
    const [bgImg, setBgImg] = useState({
        bgSize: "cover",
        bgCol: {
            start: "rgba(0,0,0,0.4)",
            end: "rgba(0,0,0,0.4)",
            deg: 0
        }
    });
    const [tmpBg, setTmpBg] = useState(null);
    const [animation, setAnimation] = useState({
        active: true,
        duration: 200
    });
    const [borderRadius, setBorderRadius] = useState("5px");

    //apps
    const [clock, setClock] = useState({
        format: 12,
        showSec: false,
        separator: ":",
        pulse: true,
        am: "a.m.",
        pm: "p.m.",
        greet: {
            name: "User",
            morning: "Good morning, ",
            afternoon: "Good afternoon, ",
            evening: "Good evening, ",
            night: "Good night, "
        }
    });
    const [date, setDate] = useState({
        format1: "dddd, MMM D",
        format2: "YYYY"
    })
    const [lists, setLists] = useState([]);
    const [cards, setCards] = useState([]);

    const usrConfigStore = storage.defineItem("sync:usrConfig",{
        fallback: DefaultCONFIG,
        init: () => {return DefaultCONFIG},
    })

    useEffect(()=>{
        async function fetchUsrConfigs(){
            try {
                const fetchedConfig = await usrConfigStore.getValue();
                setCols(fetchedConfig.layout?.cols || DefaultCONFIG.layout.cols);
                setRows(fetchedConfig.layout?.rows || DefaultCONFIG.layout.rows);
                setGap(fetchedConfig.layout?.gap || DefaultCONFIG.layout.gap);
                setItems(fetchedConfig.layout?.items || DefaultCONFIG.layout.items);

                setAccent(fetchedConfig.theme?.accent || DefaultCONFIG.theme.accent);
                setApp(fetchedConfig.theme?.app || DefaultCONFIG.theme.app);
                setText(fetchedConfig.theme?.text || DefaultCONFIG.theme.text);
                setIcon(fetchedConfig.theme?.icon || DefaultCONFIG.theme.icon);
                setBgImg(fetchedConfig.theme?.bgImg || DefaultCONFIG.theme.bgImg);
                setAnimation(fetchedConfig.theme?.animation || DefaultCONFIG.theme.animation);
                setBorderRadius(fetchedConfig.theme?.borderRadius || DefaultCONFIG.theme.borderRadius);
                

            }catch(e){
                console.error(e);
            }
        };
        fetchUsrConfigs();
    },[])

    useEffect(()=>{
        setItems(_arrLenCh(items, cols*rows));
    },[cols, rows])

    useEffect(()=>{
        console.log(tmpBg);
    },[tmpBg])

    const _itemsLists = (idx, item) => {
        return (
            <select key={idx} style={{"--hCalc": `${(80/rows)}%`, "--wCalc": `${(80/cols)}%`,"--gapCalc": `${gap/6}vw`}} className={`${idx >= rows*cols? "hidden" : null} h-[--hCalc] w-[--wCalc] m-[--gapCalc] bg-slate-700 rounded-md text-center`} value={item} onChange={(e)=>{setItems( [...items].map((x, i) => i === idx ? e.target.value : x) )}}>
                <option value="clock">Clock</option>
                <option value="cardbox">Cards</option>
                <option value="memo">Memo</option>
                <option value="listbox">Lists</option>
                <option value="date">Date</option>
            </select>
        )
    }

    return (
            <form className="flex flex-col p-2">
                <Tabs defaultValue="layout">
                    <Tabs.List>
                        <Tabs.Tab value="layout" leftSection={<Icon icon={"ph:layout"} />}>Layout</Tabs.Tab>
                        <Tabs.Tab value="theme" leftSection={<Icon icon={"ph:paint-brush-household"} />}>Theme</Tabs.Tab>
                        <Tabs.Tab value="apps" leftSection={<Icon icon={"ph:app-window"} />}>Apps</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="layout">
                        <div className="text-sm flex flex-wrap gap-5 mt-1">
                            <NumberInput label="Columns" value={cols} onChange={setCols} min={2} max={4} step={2} className="w-[5vw]"/>
                            <NumberInput label="Rows" value={rows} onChange={setRows} min={1} max={3} step={1} className="w-[5vw]"/>
                            <div>
                                <Text fw={500}>Gap</Text>
                                <Slider value={gap} onChange={setGap} min={0} max={6} step={1} className="w-[15vw] mt-1" />
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-1 mt-1">
                                <Text>Items</Text><Text className="italic">(Columns first, actual gap is bigger)</Text>
                            </div>
                            <div className="h-[35svw] aspect-video flex flex-col flex-wrap border justify-center items-center">
                                {items.map((item, idx) => _itemsLists(idx, item))}
                            </div>
                        </div>
                    </Tabs.Panel>

                    <Tabs.Panel value="theme">
                        <div className="flex gap-5 mt-1">
                            <ColorInput label="Accent Color" description="Used when hovering" value={accent} onChange={setAccent} className="w-[15vw]"/>
                            <ColorInput label="App Color" description="Used for apps' background" value={app} onChange={setApp} className="w-[15vw]"/>
                        </div>
                        <Text fw={500}>Text Properties</Text>
                        <div className="border  p-1 justify-center items-center mb-1">
                            <TextInput label="Font" value={text.font} onChange={(e)=>setText({...text, font: e.currentTarget.value})} className="w-[15vw]" placeholder="Default"/>
                            <div className="flex gap-5 mt-1">
                                <TextInput label="Primary Size" value={text.size.primary} onChange={(e)=>setText({...text, size: {...text.size, primary: e.currentTarget.value}})} className="w-[7vw]" />
                                <TextInput label="Secondary Size" value={text.size.secondary} onChange={(e)=>setText({...text, size: {...text.size, secondary: e.currentTarget.value}})} className="w-[7vw]" />
                                <TextInput label="Date Size" value={text.size.date} onChange={(e)=>setText({...text, size: {...text.size, date: e.currentTarget.value}})} className="w-[7vw]" />
                                <TextInput label="Item Text Size" value={text.size.itemText} onChange={(e)=>setText({...text, size: {...text.size, itemText: e.currentTarget.value}})} className="w-[7vw]" />
                            </div>
                            <div className="flex gap-5 mt-1">
                                <ColorInput label="Text Color" value={text.color.fg} onChange={(e)=>setText({...text, color: {...text.color, fg: e}})} className="w-[15vw]"/>
                                <ColorInput label="Hover Color" value={text.color.sfg} onChange={(e)=>setText({...text, color: {...text.color, sfg: e}})} className="w-[15vw]"/>
                            </div>
                        </div>
                        <TextInput label="Icon Size" value={icon.size} onChange={(e)=>setIcon({size: e.currentTarget.value})} className="w-[7vw]" />
                        <div className="flex gap-1 mt-1">
                            <Text fw={500}>Background</Text><Text className="italic">(color applies before background image)</Text>
                        </div>
                        <div className="flex flex-col border p-1 gap-1 mb-1">
                            <div className="flex items-center gap-5">
                                <Image src={bgImg.img} className="w-[15vw] h-[10vh] object-cover" />
                                <FileInput label="Background Image" value={typeof tmpBg === "string" ? null : tmpBg} onChange={(e)=>{setTmpBg(e)}} className="w-[15vw]" placeholder="Click to select" accept="image/png,image/jpeg" clearable leftSection={<ActionIcon className="mr-1" onClick={()=>{
                                    var tmp;
                                    if (!tmpBg){ return; }else{ tmp = tmpBg; }
                                    setBgImg({...bgImg, img: typeof tmp === "string" ? tmp : URL.createObjectURL(tmp) });
                                    setTmpBg(null);
                                    }} ><Icon icon={"material-symbols:upload"} /></ActionIcon>}/>
                                <Select label="Background Size" value={bgImg.bgSize} className="w-[15vw]"
                                data={[{value: 'cover', label: "Cover"},{value: 'contain', label: "Contain"},{value: 'auto', label: "Auto"}]} 
                                onChange={(val, _) => setBgImg({...bgImg, bgSize: val})} allowDeselect={false} />
                            </div>
                            <div className="flex items-center gap-5">
                                <ColorInput label="Background Gradient Start" value={bgImg.bgCol.start} onChange={(e)=>setBgImg({...bgImg, bgCol: {...bgImg.bgCol, start: e}})} format="rgba" className="w-[15vw]"/>
                                <ColorInput label="Background Gradient End" value={bgImg.bgCol.end} onChange={(e)=>setBgImg({...bgImg, bgCol: {...bgImg.bgCol, end: e}})} format="rgba" className="w-[15vw]"/>
                                <Text fw={500}>Gradient Angle</Text>
                                <AngleSlider value={bgImg.bgCol.deg} size={50} onChange={(e)=>setBgImg({...bgImg, bgCol: {...bgImg.bgCol, deg: e}})} step={15} formatLabel={(val) => `${val}°`} className="-ml-3" />
                            </div>
                        </div>
                        <div className="flex gap-1 mt-1 items-center">
                            <Switch checked={animation.active} onChange={(e)=>setAnimation({active: e.currentTarget.checked, duration: animation.duration})} /><Text>Animation </Text>
                        </div>
                        <div className={`${animation.active? null : "hidden"} flex border mt-1 p-1 items-center gap-5`}>
                            <NumberInput disabled={!animation.active} label="Duration (ms)" value={animation.duration} onChange={(e)=>setAnimation({active: animation.active, duration: e})} min={1} max={9999} className={`w-[10vw]`} />
                        </div>
                        <NumberInput label="Border Radius (px)" value={borderRadius} onChange={setBorderRadius} className="mt-1 w-[8vw]" />
                    </Tabs.Panel>

                    <Tabs.Panel value="apps">

                    </Tabs.Panel>

                </Tabs>
            </form>
    )
}