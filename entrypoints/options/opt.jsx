import { useEffect, useState } from "react";
import {DefaultCONFIG} from '../../assets/defaultConfig'
import {storage} from "wxt/storage";
import { ActionIcon, Accordion, Anchor, AngleSlider, CloseButton, Collapse, ColorInput, FileInput, HoverCard, Image, NumberInput, Select, Slider, Switch, Text, TextInput, Tabs, Checkbox, SegmentedControl, InputBase, Pill} from "@mantine/core";
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
        },
        img: "https://picsum.photos/1920/1080"
    });
    const [tmpBg, setTmpBg] = useState(null);
    const [animation, setAnimation] = useState({
        active: true,
        duration: 200
    });
    const [borderRadius, setBorderRadius] = useState("5px");

    //apps
    const [clock, setClock] = useState({
        format12: true,
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
                
                setClock(fetchedConfig.apps?.clock || DefaultCONFIG.apps.clock);
                setDate(fetchedConfig.apps?.date || DefaultCONFIG.apps.date);
                setLists(fetchedConfig.apps?.lists || DefaultCONFIG.apps.lists);
                setCards(fetchedConfig.apps?.cards || DefaultCONFIG.apps.cards);

                console.log(lists); 
            }catch(e){
                console.error(e);
            }
        };
        fetchUsrConfigs();
    },[])

    useEffect(()=>{
        setItems(_arrLenCh(items, cols*rows));
    },[cols, rows])

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

    const [listFocus, setListFocus] = useState(``);

    const handleListTabsSelect = (val) => {
        if(val === "add"){
            if (lists.length >= 8){ return; }
            setLists([...lists, DefaultCONFIG.apps.lists[0]]);
            setListFocus(`list${lists.length}`);
        }else{
            setListFocus(val);
        }
        console.log(lists);
    }

    const handleDeletList = (e) => {
        e.preventDefault();
        setLists([...lists].filter((_, idx) => idx !== parseInt(listFocus.slice(-1)) ));
        setListFocus(``);
    }

    const pillTabs = lists
    .map((list, idx) => {
        return <Tabs.Tab key={idx} value={`list${idx}`} rightSection={<CloseButton onClick={handleDeletList} className="-my-1 -mr-2"/>}>{`List ${idx+1}`}</Tabs.Tab>;
    });

    const pillsPanels = lists
    .map((list, idx) => {
        return <Tabs.Panel key={idx} value={`list${idx}`} >
            <Text fw={500}>Layout</Text>
            <div className="flex gap-2 border p-1 items-center mb-1">
                <NumberInput label="Sublists" value={list.layout.cols} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, layout: {...x.layout, cols: e}} : x))} min={1} max={2} step={1} className="w-[5svw]"/>
                <NumberInput label="Gap (rem)" value={list.layout.gap} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, layout: {...x.layout, gap: e}} : x))} min={0} max={6} step={1} className="w-[5svw]"/>
            </div>
            <Text fw={500}>Sublists</Text>
            <div className="flex gap-2">
                <div className="flex flex-col gap-2 border p-1 justify-center m-1">
                    <div className="flex gap-2 items-center">
                        <Checkbox label="Use Iconify Icon?" checked={list.content[0].iconType} onChange={(e)=>{setLists([...lists].map((x, i) => i === idx ? {...x, content: [{...x.content[0], iconType: e.currentTarget.checked}, x.content[1]]} : x))}} />
                        <HoverCard>
                            <HoverCard.Target>
                                <Icon icon="material-symbols:info" height="20" />
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Anchor href="https://icon-sets.iconify.design/" target="_blank">Iconify Icons</Anchor>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </div>
                    <div className="flex gap-1">
                        <TextInput label={`Sublist 1 ${list.content[0].iconType ? "Icon" : ""} Name`} value={list.content[0].iconTitle} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, content: [{...x.content[0], iconTitle: e.currentTarget.value}]} : x))} className="w-[10svw]" />
                        <NumberInput label="Gap (rem)" value={list.content[0].gap} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, content: [{...x.content[0], gap: e}, x.content[1]]} : x))} min={0} max={6} step={1} className="w-[5svw]"/>
                    </div>
                    {list.content[0].items.map((item, iidx) => {
                        return <div key={`lsi${idx}${iidx}`} className="flex gap-1">
                            <div className="flex flex-col gap-2 items-center w-[5svw]">
                                <Text className="text-wrap text-center">Use Iconify</Text>
                                <Switch checked={item.iconType} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, content: [{...x.content[0], items: x.content[0].items.map((y, j) => j === iidx ? {...y, iconType: e.currentTarget.checked} : y)}, x.content[1]]} : x))} />
                            </div>
                            <TextInput label={`Item ${iidx+1} Icon`} value={item.icon} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, content: [{...x.content[0], items: x.content[0].items.map((y, j) => j === iidx ? {...y, icon: e.currentTarget.value} : y)}, x.content[1]]} : x))} className="w-[10svw]" />
                            <TextInput label={`Item ${iidx+1} Title`} value={item.title} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, content: [{...x.content[0], items: x.content[0].items.map((y, j) => j === iidx ? {...y, title: e.currentTarget.value} : y)}, x.content[1]]} : x))} className="w-[10svw]" />
                            <TextInput label={`Item ${iidx+1} Link`} value={item.link} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, content: [{...x.content[0], items: x.content[0].items.map((y, j) => j === iidx ? {...y, link: e.currentTarget.value} : y)}, x.content[1]]} : x))} className="w-[10svw]" />
                        </div>
                    })}
                </div>
                <div className={`${list.layout.cols >= 2 ? "flex" : "hidden"} flex-col gap-2 border p-1 justify-center m-1`}>
                    <div className="flex gap-2 items-center">
                        <Checkbox label="Use Iconify Icon?" checked={list.content[1].iconType} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, content: [x.content[0], {...x.content[1], iconType: e.currentTarget.checked}]} : x))} />
                        <HoverCard>
                            <HoverCard.Target>
                                <Icon icon="material-symbols:info" height="20" />
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Anchor href="https://icon-sets.iconify.design/" target="_blank">Iconify Icons</Anchor>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </div>
                    <div className="flex gap-1">
                        <TextInput label={`Sublist 2 ${list.content[1].iconType ? "Icon" : ""} Name`} value={list.content[1].iconTitle} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, content: [{...x.content[1], iconTitle: e.currentTarget.value}]} : x))} className="w-[15svw]" />
                        <NumberInput label="Gap (rem)" value={list.content[1].gap} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, content: [x.content[0], {...x.content[1], gap: e}]} : x))} min={0} max={6} step={1} className="w-[5svw]"/>
                    </div>
                    {list.content[1].items.map((item, iidx) => {
                        return <div key={`lsi${idx}${iidx}`} className="flex gap-1">
                            <div className="flex flex-col gap-2 items-center w-[5svw]">
                                <Text className="text-wrap text-center">Use Iconify</Text>
                                <Switch checked={item.iconType} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, content: [x.content[0], {...x.content[1], items: x.content[1].items.map((y, j) => j === iidx ? {...y, iconType: e.currentTarget.checked} : y)}]} : x))} />
                            </div>
                            <TextInput label={`Item ${iidx+1} Icon`} value={item.icon} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, content: [x.content[0], {...x.content[1], items: x.content[1].items.map((y, j) => j === iidx ? {...y, icon: e.currentTarget.value} : y)}]} : x))} className="w-[10svw]" />
                            <TextInput label={`Item ${iidx+1} Title`} value={item.title} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, content: [x.content[0], {...x.content[1], items: x.content[1].items.map((y, j) => j === iidx ? {...y, title: e.currentTarget.value} : y)}]} : x))} className="w-[10svw]" />
                            <TextInput label={`Item ${iidx+1} Link`} value={item.link} onChange={(e)=>setLists([...lists].map((x, i) => i === idx ? {...x, content: [x.content[0], {...x.content[1], items: x.content[1].items.map((y, j) => j === iidx ? {...y, link: e.currentTarget.value} : y)}]} : x))} className="w-[10svw]" />
                        </div>
                    })}
                </div>
            </div>
        </Tabs.Panel>;
    });

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
                            <NumberInput label="Columns" value={cols} onChange={setCols} min={2} max={4} step={2} className="w-[5svw]"/>
                            <NumberInput label="Rows" value={rows} onChange={setRows} min={1} max={3} step={1} className="w-[5svw]"/>
                            <div>
                                <Text fw={500}>Gap</Text>
                                <Slider value={gap} onChange={setGap} min={0} max={6} step={1} className="w-[15svw] mt-1" />
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
                            <ColorInput label="Accent Color" description="Used when hovering" value={accent} onChange={setAccent} className="w-[15svw]"/>
                            <ColorInput label="App Color" description="Used for apps' background" value={app} onChange={setApp} className="w-[15svw]"/>
                        </div>
                        <Text fw={500}>Text Properties</Text>
                        <div className="border p-1 justify-center items-center mb-1">
                            <TextInput label="Font" value={text.font} onChange={(e)=>setText({...text, font: e.currentTarget.value})} className="w-[15svw]" placeholder="Default"/>
                            <div className="flex gap-5 mt-1">
                                <TextInput label="Primary Size" value={text.size.primary} onChange={(e)=>setText({...text, size: {...text.size, primary: e.currentTarget.value}})} className="w-[8svw]" />
                                <TextInput label="Secondary Size" value={text.size.secondary} onChange={(e)=>setText({...text, size: {...text.size, secondary: e.currentTarget.value}})} className="w-[8svw]" />
                                <TextInput label="Date Size" value={text.size.date} onChange={(e)=>setText({...text, size: {...text.size, date: e.currentTarget.value}})} className="w-[8svw]" />
                                <TextInput label="Item Text Size" value={text.size.itemText} onChange={(e)=>setText({...text, size: {...text.size, itemText: e.currentTarget.value}})} className="w-[8svw]" />
                            </div>
                            <div className="flex gap-5 mt-1">
                                <ColorInput label="Text Color" value={text.color.fg} onChange={(e)=>setText({...text, color: {...text.color, fg: e}})} className="w-[15svw]"/>
                                <ColorInput label="Hover Color" value={text.color.sfg} onChange={(e)=>setText({...text, color: {...text.color, sfg: e}})} className="w-[15svw]"/>
                            </div>
                        </div>
                        <TextInput label="Icon Size" value={icon.size} onChange={(e)=>setIcon({size: e.currentTarget.value})} className="w-[7svw]" />
                        <div className="flex gap-1 mt-1">
                            <Text fw={500}>Background</Text><Text className="italic">(color applies before background image)</Text>
                        </div>
                        <div className="flex flex-col border p-1 gap-1 mb-1">
                            <div className="flex items-center gap-5">
                                <Image src={bgImg.img} className="w-[15vw] h-[10vh] object-cover" />
                                <FileInput label="Background Image" value={typeof tmpBg === "string" ? null : tmpBg} onChange={(e)=>{setTmpBg(e)}} className="w-[15svw]" placeholder="Click to select" accept="image/png,image/jpeg" clearable leftSection={<ActionIcon className="mr-1" onClick={()=>{
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
                                <ColorInput label="Background Gradient End" value={bgImg.bgCol.end} onChange={(e)=>setBgImg({...bgImg, bgCol: {...bgImg.bgCol, end: e}})} format="rgba" className="w-[15svw]"/>
                                <Text fw={500}>Gradient Angle</Text>
                                <AngleSlider value={bgImg.bgCol.deg} size={50} onChange={(e)=>setBgImg({...bgImg, bgCol: {...bgImg.bgCol, deg: e}})} step={15} formatLabel={(val) => `${val}°`} className="-ml-3" />
                            </div>
                        </div>
                        <div className="flex gap-1 mt-1 items-center">
                            <Switch checked={animation.active} onChange={(e)=>setAnimation({active: e.currentTarget.checked, duration: animation.duration})} /><Text>Animation </Text>
                        </div>
                        <Collapse in={animation.active} className={`flex border mt-1 p-1 items-center gap-5`}>
                            <NumberInput label="Duration (ms)" value={animation.duration} onChange={(e)=>setAnimation({active: animation.active, duration: e})} min={1} max={9999} className={`w-[10svw]`} />
                        </Collapse>
                        <NumberInput label="Border Radius (px)" value={borderRadius} onChange={setBorderRadius} className="mt-1 w-[8vw]" />
                    </Tabs.Panel>

                    <Tabs.Panel value="apps">
                        <Accordion multiple defaultValue={["clock","date","lists"]}>
                            <Accordion.Item value="clock" key="clock">
                                <Accordion.Control icon={<Icon icon="tabler:clock" />}><Text>Clock</Text></Accordion.Control>
                                <Accordion.Panel>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2 items-center">
                                            <SegmentedControl value={clock.format12? "12" : "24"} data={[{value: "12", label: "12 Hour"},{value: "24", label: "24 Hour"}]} onChange={(val, _) => setClock({...clock, format12: val === "12"})} />
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Checkbox label="Show Seconds" checked={clock.showSec} onChange={(e)=>setClock({...clock, showSec: e.currentTarget.checked})} />
                                            <Checkbox label="Pulse Separator" checked={clock.pulse} onChange={(e)=>setClock({...clock, pulse: e.currentTarget.checked})} />
                                        </div>
                                        <div className="flex gap-2">
                                            <TextInput label="Separator" value={clock.separator} onChange={(e)=>setClock({...clock, separator: e.currentTarget.value})} className="w-[5svw]" maxLength={1} placeholder=":"/>
                                            <TextInput label="A.M. Text" value={clock.am} onChange={(e)=>setClock({...clock, am: e.currentTarget.value})} className="w-[5svw]" placeholder="a.m."/>
                                            <TextInput label="P.M. Text" value={clock.pm} onChange={(e)=>setClock({...clock, pm: e.currentTarget.value})} className="w-[5svw]" placeholder="p.m."/>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Text fw={500}>Greetings</Text>
                                            <HoverCard>
                                                <HoverCard.Target>
                                                    <Icon icon="material-symbols:info" height="20" />
                                                </HoverCard.Target>
                                                <HoverCard.Dropdown>
                                                    <Text>Morning: 6 a.m. - 12 p.m.</Text>
                                                    <Text>Afternoon: 12 p.m. - 6 p.m.</Text>
                                                    <Text>Evening: 6 p.m. - 9 p.m.</Text>
                                                    <Text>Night: 9 p.m. - 6 a.m.</Text>
                                                </HoverCard.Dropdown>
                                            </HoverCard>
                                        </div>
                                        <div className="flex flex-col border p-1 gap-1 mb-1">
                                            <div className="flex gap-2">
                                                <TextInput label="User name" value={clock.greet.name} onChange={(e)=>setClock({...clock, greet: {...clock.greet, name: e.currentTarget.value}})} className="w-[10svw]" placeholder="User"/>
                                                <TextInput label="Morning" value={clock.greet.morning} onChange={(e)=>setClock({...clock, greet: {...clock.greet, morning: e.currentTarget.value}})} className="w-[10svw]" placeholder="Good morning,"/>
                                                <TextInput label="Afternoon" value={clock.greet.afternoon} onChange={(e)=>setClock({...clock, greet: {...clock.greet, afternoon: e.currentTarget.value}})} className="w-[10svw]" placeholder="Good afternoon,"/>
                                                <TextInput label="Evening" value={clock.greet.evening} onChange={(e)=>setClock({...clock, greet: {...clock.greet, evening: e.currentTarget.value}})} className="w-[10svw]" placeholder="Good evening,"/>
                                                <TextInput label="Night" value={clock.greet.night} onChange={(e)=>setClock({...clock, greet: {...clock.greet, night: e.currentTarget.value}})} className="w-[10svw]" placeholder="Good night,"/>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item value="date" key="date">
                                <Accordion.Control icon={<Icon icon="bi:calendar2-date" />}>
                                <div className="flex gap-1 items-center">
                                <Text>Date</Text>
                                <HoverCard>
                                    <HoverCard.Target>
                                        <Icon icon="material-symbols:info" height="20" />
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
                                        <Text>Uses Dayjs format string: <Anchor href="https://day.js.org/docs/en/display/format" target="_blank">day.js.org</Anchor></Text>
                                    </HoverCard.Dropdown>
                                </HoverCard>
                                </div>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <TextInput label="Line 1" value={date.format1} onChange={(e)=>setDate({...date, format1: e.currentTarget.value})} className="w-[15svw]" placeholder="dddd, MMM D"/>
                                    <TextInput label="Line 2" value={date.format2} onChange={(e)=>setDate({...date, format2: e.currentTarget.value})} className="w-[15svw]" placeholder="YYYY"/>
                                </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item value="lists" key="lists">
                                <Accordion.Control icon={<Icon icon="material-symbols:list" />}>
                                    <div className="flex gap-1 items-center">
                                    <Text>Lists</Text>
                                        <HoverCard>
                                            <HoverCard.Target>
                                                <Icon icon="material-symbols:info" height="20" />
                                            </HoverCard.Target>
                                            <HoverCard.Dropdown>
                                                <Text>Lists are assigned columns first, one by one</Text>
                                            </HoverCard.Dropdown>
                                        </HoverCard>
                                    </div>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Tabs value={listFocus} variant="pills" onChange={handleListTabsSelect} activateTabWithKeyboard={false} >
                                        <Tabs.List>
                                            {pillTabs}
                                            <Tabs.Tab value="add" leftSection={<Icon icon="ic:sharp-plus" />} />
                                        </Tabs.List>
                                        {pillsPanels}
                                    </Tabs>
                                </Accordion.Panel>                       
                            </Accordion.Item>
                        </Accordion>
                    </Tabs.Panel>

                </Tabs>
            </form>
    )
}