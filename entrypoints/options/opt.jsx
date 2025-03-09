import { useEffect, useState } from "react";
import { DefaultCONFIG } from '../../assets/defaultConfig';
import { storage } from "wxt/storage";
import { ActionIcon, Accordion, Anchor, AngleSlider, Button, Checkbox, Collapse, ColorInput, Dialog, Divider, FileInput, Group, HoverCard, Image, Modal, MultiSelect, NumberInput, Select, SegmentedControl, Slider, Switch, Tabs, Text, TextInput, Space } from "@mantine/core";
import { Icon } from '@iconify-icon/react';

function _arrLenCh(arr, len) {
    //helper function to change array length
    const arrLen = arr.length;
    var tmpArr = [...arr];
    if (arrLen < len) {
        tmpArr.length = len;
        tmpArr = tmpArr.fill("clock", arrLen);
    }
    return tmpArr;
}

function isValidHttpUrl(string) {
    let url;
    
    try {
        url = new URL(string);
    } catch (_) {
        return false;  
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

function isDataURL(s) {
    // gist.github.com/khanzadimahdi/bab8a3416bdb764b9eda5b38b35735b8
    return /^data:((?:\w+\/(?:(?!;).)+)?)((?:;[\w\W]*?[^;])*),(.+)$/.test(s);
}


export default function Options() {
    const [modalOpened, setModalOpened] = useState(false);
    const [dialogOpened, setDialogOpened] = useState(false);
    const [fetchFailed, setFetchFailed] = useState(false);
    const [submitDialogFailed, setSubmitDialogFailed] = useState(false);
    const [submitFailContent, setSubmitFailContent] = useState("");
    const [bgImgErr, setBgImgErr] = useState(false);
    const [curOpt, setCurOpt] = useState("layout");

    //see default config
    //layout
    const [cols, setCols] = useState(2);
    const [rows, setRows] = useState(2);
    const [gap, setGap] = useState(1);
    const [skipIdx, setSkipIdx] = useState(new Set([]));
    const [items, setItems] = useState(["clock", "cardbox", "date", "listbox"]);

    //theme
    const [bg, setBg] = useState("#19171a");
    const [accent, setAccent] = useState("#57a0d9");
    const [app, setApp] = useState("#201e21");
    const [text, setText] = useState({
        font: "",
        isBold: false,
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
    const [icon, setIcon] = useState({ size: "3vh" });
    const [bgImg, setBgImg] = useState({
        bgSize: "cover",
        bgCol: {
            start: "rgba(0,0,0,0.4)",
            end: "rgba(0,0,0,0.4)",
            deg: 0
        },
        img: "https://picsum.photos/1920/1080",
        imgIsUrl: true,
        useCol: false
    });
    const [tmpBg, setTmpBg] = useState("");
    const [animation, setAnimation] = useState({
        active: true,
        duration: 200
    });
    const [borderRadius, setBorderRadius] = useState("5px");

    //apps
    const [clock, setClock] = useState({
        format12: true,
        showSec: false,
        lead0: true,
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
    const [weather, setWeather] = useState({
            provider: "o", // o for open meteo, p for pirate weather
            lat: 52,
            lon: 0,
            apiKey: "", //pirate weather
            showIcon: true, //weather icon
            f: false, //fahrenheit
            interval: 30, //minutes
            items: [ //feelsLike, alert, weather, max 2 line
            "feelsLike",
        ],
    });

    const usrConfigStore = storage.defineItem("sync:usrConfig", {
        fallback: DefaultCONFIG,
        init: () => { return DefaultCONFIG },
    })

    const usrBgImg = storage.defineItem("local:userBgImage", {
        fallback: "https://picsum.photos/1920/1080",
        init: () => { return "https://picsum.photos/1920/1080" },
    })

    const fetchUsrConfigs = async () => {
        try {
            const fetchedConfig = await usrConfigStore.getValue();
            setCols(fetchedConfig.layout?.cols || DefaultCONFIG.layout.cols);
            setRows(fetchedConfig.layout?.rows || DefaultCONFIG.layout.rows);
            setGap(fetchedConfig.layout?.gap || DefaultCONFIG.layout.gap);
            setItems(fetchedConfig.layout?.items || DefaultCONFIG.layout.items);
            setSkipIdx(new Set(fetchedConfig.layout?.skipIdx || DefaultCONFIG.layout.skipIdx));

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

            const fetchedBgImg = await usrBgImg.getValue();
            setBgImg({ ...bgImg, img: fetchedBgImg });
        } catch (e) {
            console.error(e);
            setFetchFailed(true);
        }
    };

    useEffect(() => {
        fetchUsrConfigs();
    }, []);

    useEffect(() => {
        setItems(_arrLenCh(items, cols * rows));
    }, [cols, rows]);

    const _itemsLists = (idx, item) => (
        <ItemList key={idx} idx={idx} item={item}  />
    );

    const getSecondIndex = (index) => {
        return index + rows;
    };

    const handleItemListChange = (e, idx) => {
        setItems([...items].map((x, i) => i === idx ? e.target.value : x));
        const secondIndex = getSecondIndex(idx);
        if(e.target.value === "clock2" || e.target.value === "date2") {
            setSkipIdx(prev => new Set(prev).add(secondIndex)); 
        } else {
            setSkipIdx(prev => {
                const newSet = new Set(prev);
                newSet.delete(secondIndex);
                return newSet;
            });
        }
    };

    const ItemList = ({ idx, item }) => (
        <select value={skipIdx.has(idx) ? "empty" : item} key={idx} style={{ "--hCalc": `${(80 / rows)}%`, "--wCalc": `${(80 / cols)}%`, "--gapCalc": `${gap / 6}vw` }} disabled={skipIdx.has(idx)} className={`${idx >= rows * cols ? "hidden" : null} h-[--hCalc] w-[--wCalc] m-[--gapCalc] bg-slate-700 rounded-md text-center`} onChange={(e) => handleItemListChange(e, idx)}>
            <option value="clock">Clock</option>
            <option value="date">Date</option>
            {
            idx < (rows * cols - rows) ?
                <>
                    <option value="clock2">Clock (2 cell wide)</option>
                    <option value="date2">Date (2 cell wide)</option>
                </>
                : null
            }
            <option value="cardbox">Cards</option>
            <option value="memo">Quick Memo</option>
            <option value="listbox">Lists</option>
            <option value="weather">Weather</option>
            <option hidden value="empty">Empty</option>
        </select>
    );

    const [listFocus, setListFocus] = useState(``);
    const [cardFocus, setCardFocus] = useState(``);

    const handleListTabsSelect = (val) => {
        if (val === "add") {
            if (lists.length >= 8) { return; }
            setLists([...lists, DefaultCONFIG.apps.lists[0]]);
            setListFocus(`list${lists.length}`);
        } else {
            setListFocus(val);
        }
    }

    const handleCardTabsSelect = (val) => {
        if (val === "add") {
            if (cards.length >= 8) { return; }
            setCards([...cards, DefaultCONFIG.apps.cards[0]]);
            setCardFocus(`card${cards.length}`);
        } else {
            setCardFocus(val);
        }
    }

    const handleDeleteList = (e) => {
        e.preventDefault();
        setLists((prev) => [...prev].filter((_, idx) => idx !== parseInt(listFocus.slice(-1))));
        setListFocus(lists.length > 1 ? `list${lists.length - 2}` : ``);
    }

    const handleDeleteCard = (e) => {
        e.preventDefault();
        setCards([...cards].filter((_, idx) => idx !== parseInt(cardFocus.slice(-1))));
        setCardFocus(cards.length > 1 ? `card${cards.length - 2}` : ``);
    }

    const cardTabs = cards
        .map((_, idx) => {
            return <Tabs.Tab key={idx} value={`card${idx}`} rightSection={<div onClick={handleDeleteCard} className="hover:bg-slate-800 p-1 rounded-md -m-1"><Icon icon="material-symbols:close" /></div>}>{`Cards ${idx + 1}`}</Tabs.Tab>;
        });

    const pillTabs = lists
        .map((_, idx) => {
            return <Tabs.Tab key={idx} value={`list${idx}`} rightSection={<div onClick={handleDeleteList} className="hover:bg-slate-800 p-1 -m-1 rounded-md"><Icon icon="material-symbols:close" /></div>}>{`List ${idx + 1}`}</Tabs.Tab>;
        });

    const cardPanels = cards
        .map((card, idx) => {
            return (
                <Tabs.Panel key={idx} value={`card${idx}`}>
                    <Text fw={500}>Layout</Text>
                    <div className="flex gap-2 items-center border p-1 mb-1">
                        <NumberInput label="Columns" value={card.layout.cols} max={3} min={1} step={1} onChange={(e) => setCards([...cards].map((x, i) => i === idx ? { ...x, layout: { ...x.layout, cols: e } } : x))} className="w-[7svw]" />
                        <NumberInput label="Rows" value={card.layout.rows} min={1} max={2} step={1} onChange={(e) => setCards([...cards].map((x, i) => i === idx ? { ...x, layout: { ...x.layout, rows: e } } : x))} className="w-[7svw]" />
                        <NumberInput label="Gap (rem)" value={card.layout.gap} min={0} max={6} step={1} onChange={(e) => setCards([...cards].map((x, i) => i === idx ? { ...x, layout: { ...x.layout, gap: e } } : x))} className="w-[7svw]" />
                    </div>
                    <div className="flex gap-1 items-center">
                        <Text fw={500}>Cards</Text>
                        <HoverCard>
                            <HoverCard.Target>
                                <Icon icon="material-symbols:info" height="20" />
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Anchor href="https://icon-sets.iconify.design/" target="_blank">Iconify Icons</Anchor>
                                <Space />Enable to use Iconify Icons as card names
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </div>
                    <div className="flex flex-col gap-2 border p-1 mb-1">
                        {card.content.map((item, iidx) => {
                            if (iidx >= card.layout.cols * card.layout.rows) { return; }
                            return <div key={`ci${idx}${iidx}`} className="flex gap-1">
                                <div className="flex flex-col gap-2 items-center w-[5svw]">
                                    <Text size={"sm"} className="text-wrap text-center leading-[1]">Use Iconify</Text>
                                    <Checkbox checked={item.iconType} onChange={(e) => setCards([...cards].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === iidx ? { ...y, iconType: e.currentTarget.checked } : y) } : x))} />
                                </div>
                                <TextInput label={`Card ${iidx + 1} ${item.iconType ? "Icon" : "Text"}`} value={item.iconTitle} onChange={(e) => setCards([...cards].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === iidx ? { ...y, iconTitle: e.currentTarget.value } : y) } : x))} className="w-[10svw]" />
                                <TextInput label={`Card ${iidx + 1} Link`} value={item.link} onChange={(e) => setCards([...cards].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === iidx ? { ...y, link: e.currentTarget.value } : y) } : x))} className="w-[10svw]" />
                            </div>
                        })}
                    </div>

                </Tabs.Panel>
            );
        });

        const pillsPanels = lists.map((list, idx) => {
            return (
            <Tabs.Panel key={idx} value={`list${idx}`}>
                <Text fw={500}>Layout</Text>
                <div className="flex gap-2 items-center border p-1 mb-1">
                <NumberInput label="Sublists" value={list.layout.cols} max={2} min={1} step={1} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, layout: { ...x.layout, cols: e } } : x))} className="w-[7svw]" />
                <NumberInput label="Gap (rem)" value={list.layout.gap} min={0} max={6} step={1} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, layout: { ...x.layout, gap: e } } : x))} className="w-[7svw]" />
                </div>
                <div className="flex gap-1 items-center">
                <Text fw={500}>Sublist Configs</Text>
                </div>
                <div className="flex gap-2 p-1 mb-1">
                {list.content.map((sublist, sidx) => {
                    if(sidx >= list.layout.cols) { return; }
                    return (
                    <div key={`li${idx}${sidx}`} className="flex flex-col gap-2 border p-1 mb-1 w-[45%]">
                        <Text fw={500}>Sublist {sidx + 1}</Text>
                        <div className="flex gap-1 items-center">
                        <Checkbox label="Use Iconify Icons" checked={sublist.iconType} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === sidx ? { ...y, iconType: e.currentTarget.checked } : y) } : x))} />
                        <HoverCard>
                            <HoverCard.Target>
                                <Icon icon="material-symbols:info" height="20" />
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Anchor href="https://icon-sets.iconify.design/" target="_blank">Iconify Icons</Anchor>
                                <Space />Enable to use Iconify Icons as sublist names
                            </HoverCard.Dropdown>
                        </HoverCard>
                        </div>
                        <TextInput label={`Sublist ${sidx + 1} ${sublist.iconType ? "Icon Name" : "Text"}`} value={sublist.iconTitle} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === sidx ? { ...y, iconTitle: e.currentTarget.value } : y) } : x))} className="w-[15svw]" />
                        <div className="flex flex-col gap-2">
                            {sublist.items.map((item, iidx) => (
                            <div key={`sli${idx}${sidx}${iidx}`} className="flex gap-2 items-center ">
                                <div className="flex flex-col gap-1 items-center justify-center">
                                    <Text size={"sm"} className="text-wrap text-center leading-[1]">Use Iconify</Text>                                    
                                    <Checkbox checked={item.iconType} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === sidx ? { ...y, items: y.items.map((z, k) => k === iidx ? { ...z, iconType: e.currentTarget.checked } : z) } : y) } : x))} />
                                </div>
                                <TextInput label={`Item ${iidx + 1} Icon`} value={item.icon} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === sidx ? { ...y, items: y.items.map((z, k) => k === iidx ? { ...z, icon: e.currentTarget.value } : z) } : y) } : x))} className="w-[15svw]" />
                                <TextInput label={`Item ${iidx + 1} Title`} value={item.title} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === sidx ? { ...y, items: y.items.map((z, k) => k === iidx ? { ...z, title: e.currentTarget.value } : z) } : y) } : x))} className="w-[15svw]" />
                                <TextInput label={`Item ${iidx + 1} Link`} value={item.link} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === sidx ? { ...y, items: y.items.map((z, k) => k === iidx ? { ...z, link: e.currentTarget.value } : z) } : y) } : x))} className="w-[15svw]" />
                            </div>
                                ))}
                        </div>
                    </div>
                )})}
                </div>
            </Tabs.Panel>
            );
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const packagedConfig = {
            layout: {
                cols: cols,
                rows: rows,
                gap: gap,
                items: [...items.map((x,idx) => skipIdx.has(idx) ? "empty" : x)],
                skipIdx: [...skipIdx]
            },
            theme: {
                bg: bg,
                accent: accent,
                app: app,
                text: text,
                icon: icon,
                bgImg: { ...bgImg, img: !isDataURL(tmpBg) ? tmpBg : "" },
                animation: animation,
                borderRadius: borderRadius
            },
            apps: {
                clock: clock,
                date: date,
                lists: lists,
                cards: cards,
                weather: weather
            }
        }
        const res = await usrConfigStore.setValue(packagedConfig).catch((err) => err);
        if (isDataURL(tmpBg)) {
            await saveUserImageToLocalStorage(tmpBg);
        }
        if (typeof res === "undefined") {
            console.log("User saved changes");
            setDialogOpened(true);
            setTimeout(() => setDialogOpened(false), 3000);
        } else {
            setSubmitFailContent(res);
            console.log(`Error at saving: ${res}`);
            setSubmitDialogFailed(true);
        }
    }

    const handleReset = async (e) => {
        e.preventDefault();
        const res = await usrConfigStore.removeValue().catch((err) => err);
        if (typeof res !== "undefined") {
            console.error(`Error at reset: ${res}`);
        }
        const ress = await usrBgImg.removeValue().catch((err) => err);
        if (typeof ress !== "undefined") {
            console.error(`Error at background image reset: ${ress}`);
        }
        setModalOpened(false);
        window.location.reload();
        console.log("User reset defaults");
    }

    const handleCancel = async (e) => {
        e.preventDefault();
        const res = await fetchUsrConfigs().catch((err) => err);
        if (typeof res !== "undefined") {
            console.error(`Error at cancel: ${res}`);
        }
        console.log("User cancelled changes");
    }

    const saveUserImageToLocalStorage = async (file) => {
        const res = await usrBgImg.setValue(file).catch((err) => err);
        if (typeof res !== "undefined") {
            console.error(`Error at saving background image: ${res}`);
        }
    };

    const tmpBgReader = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            setTmpBg(reader.result);
        };
        reader.readAsDataURL(file);
    }

    const handleBgUp = async () => {
        var tmp;
        if (!tmpBg || tmpBg === "") { 
            setBgImgErr(true);
            setTimeout(() => setBgImgErr(false), 3000);
            return; 
        } else { 
            tmp = tmpBg; 
        }
        if(typeof tmp === "object") {
            tmpBgReader(tmp);
        }else if(!isValidHttpUrl(tmp)) { 
            setBgImgErr(true);
            setTimeout(() => setBgImgErr(false), 3000);
            return; 
        }
        setBgImg({ ...bgImg, img: typeof tmp === "string" ? tmp : URL.createObjectURL(tmp) });
    }

    const handleColsUp = () => {
        if(cols === 2){
            setCols(4);
        }else{
            setCols(prev => (prev + 1) === 5 ? 4 : prev + 1);
        }
    }

    const handleColsDown = () => {
        if(cols === 4){
            setCols(2);
        }else{
            setCols(prev => (prev - 1) === 0 ? 1 : prev - 1);
        }
    }

    const CusColsCtrl = () =>{
        return (
            <div className="flex flex-col w-full gap-0">
                <ActionIcon size="xs" className="w-full border-r-0 border-b-0 rounded-tl-none rounded-bl-none rounded-br-none" variant="default" onClick={handleColsUp}><Icon icon={"mdi-light:chevron-up"} className={cols === 4 ? "text-gray-500" : ""} /></ActionIcon>
                <ActionIcon size="xs" className="w-full border-r-0 border-t-0 rounded-tl-none rounded-tr-none rounded-bl-none" variant="default" onClick={handleColsDown}><Icon icon={"mdi-light:chevron-down"} className={cols === 1 ? "text-gray-500" : ""} /></ActionIcon>
            </div>
        );
    }

    return (
        <form className="flex flex-col p-2">
            <Tabs defaultValue="layout" onChange={setCurOpt}>
                <Tabs.List>
                    <Tabs.Tab value="layout" leftSection={<Icon icon={"ph:layout"} />}>Layout</Tabs.Tab>
                    <Tabs.Tab value="theme" leftSection={<Icon icon={"ph:paint-brush-broad"} />}>Theme</Tabs.Tab>
                    <Tabs.Tab value="apps" leftSection={<Icon icon={"ph:app-window"} />}>Widgets</Tabs.Tab>
                    <Tabs.Tab value="about" ml="auto" leftSection={<Icon icon={"ix:about"} />}>About</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="layout">
                    <div className="text-sm flex flex-wrap gap-5 mt-1">
                        <NumberInput label="Columns" value={cols} onChange={setCols} min={1} max={4} step={2} hideControls rightSection={<CusColsCtrl />} clampBehavior="strict" className="w-[5svw]" />
                        <NumberInput label="Rows" value={rows} onChange={setRows} min={1} max={3} step={1} className="w-[5svw]" />
                        <div>
                            <Text fw={500}>Gap</Text>
                            <Slider value={gap} onChange={setGap} min={0} max={6} step={1} className="w-[15svw] mt-1" />
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-1 mt-1">
                            <Text>Items</Text><Text className="italic">(Arranged columns first)</Text>
                        </div>
                        <div className="h-[35svw] aspect-video flex flex-col flex-wrap border justify-center items-center">
                            {items.map((item, idx) => _itemsLists(idx, item))}
                        </div>
                        <Text size="sm">Make sure to add the corresponding configs within the Widgets tab if you are adding more than one list/cards!</Text>
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="theme">
                    <div className="flex gap-5 mt-1">
                        <ColorInput label="Accent Color" description="Used when hovering" value={accent} onChange={setAccent} className="w-[15svw]" />
                        <ColorInput label="Widget Color" description="Used for widgets' background" value={app} onChange={setApp} className="w-[15svw]" />
                        <HoverCard>
                            <HoverCard.Target>
                                <ColorInput label="Background Color" description="Applies before image" value={bg} onChange={setBg} className="w-[15svw]" />
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Text>
                                    Used when the background image is transparent/disabled.
                                    <br />Also when page is loading (especially on first load and online images),
                                    <br />this color will be shown as the background color.
                                </Text>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </div>
                    <Text fw={500}>Text Properties</Text>
                    <div className="border p-1 justify-center items-center mb-1">
                        <div className="flex gap-5">
                            <TextInput label="Font Family" value={text.font} onChange={(e) => setText({ ...text, font: e.currentTarget.value })} className="w-[15svw]" placeholder="Default" />
                                <HoverCard className="flex items-center">
                                    <HoverCard.Target>
                                        <Checkbox label="Bold Text" checked={text.isBold} onChange={(e) => setText({ ...text, isBold: e.currentTarget.checked })} />
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
                                        Applies only to lists and cards
                                    </HoverCard.Dropdown>
                                </HoverCard>
                        </div>
                        <div className="flex gap-5 mt-1">
                            <TextInput label="Primary Size" value={text.size.primary} onChange={(e) => setText({ ...text, size: { ...text.size, primary: e.currentTarget.value } })} className="w-[8svw]" />
                            <TextInput label="Secondary Size" value={text.size.secondary} onChange={(e) => setText({ ...text, size: { ...text.size, secondary: e.currentTarget.value } })} className="w-[8svw]" />
                            <TextInput label="Date Size" value={text.size.date} onChange={(e) => setText({ ...text, size: { ...text.size, date: e.currentTarget.value } })} className="w-[8svw]" />
                            <TextInput label="Item Text Size" value={text.size.itemText} onChange={(e) => setText({ ...text, size: { ...text.size, itemText: e.currentTarget.value } })} className="w-[8svw]" />
                        </div>
                        <div className="flex gap-5 mt-1">
                            <ColorInput label="Text Color" value={text.color.fg} onChange={(e) => setText({ ...text, color: { ...text.color, fg: e } })} className="w-[15svw]" />
                            <ColorInput label="Text Hover Color" value={text.color.sfg} onChange={(e) => setText({ ...text, color: { ...text.color, sfg: e } })} className="w-[15svw]" />
                        </div>
                    </div>
                    <TextInput label="Icon Size" value={icon.size} onChange={(e) => setIcon({ size: e.currentTarget.value })} className="w-[7svw]" />
                    <div className="flex gap-1 mt-1">
                        <Text fw={500}>Background</Text><Text className="italic">(Gradient color applies before background image)</Text>
                    </div>
                    <div className="flex flex-col border p-1 gap-1 mb-1">
                        <SegmentedControl value={bgImg.useCol ? "col" : "img"} onChange={(val) => setBgImg({...bgImg, useCol: val === "col"})} data={[{value: "img", label: "Use Image"}, {value: "col", label: "Use BG color"}]} className="w-[15svw]"/>
                        <div className="flex items-center gap-5">
                            {bgImg.useCol ? null :
                            <Image src={bgImg.img} className="w-[15svw] h-[10vh] object-cover" />
                        }
                            <div className="flex flex-col items-center gap-1">
                                <Text>Use Url</Text>
                                <Switch disabled={bgImg.useCol} checked={bgImg.imgIsUrl} onChange={(e) => {setBgImg({...bgImg, imgIsUrl: e.currentTarget.checked})}} />
                            </div>
                            {
                                !bgImg.imgIsUrl ? 
                                (<HoverCard>
                                    <HoverCard.Target>
                                        <FileInput disabled={bgImg.useCol} label="Background Image" value={typeof tmpBg === "string" ? null : tmpBg} onChange={(e) => { setTmpBg(e); setBgImgErr(false) }} error={bgImgErr} className="w-[15svw]" placeholder="Click here to choose" accept="image/png,image/jpeg" clearable leftSection={<ActionIcon className="mr-1" onClick={handleBgUp} ><Icon icon={"material-symbols:upload"} /></ActionIcon>} />
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
                                        <Text c="red">Uploaded background images will NOT be synced across devices!</Text>
                                        <Space />Max size: 10MB
                                        <Space />Supports: PNG, JPEG
                                    </HoverCard.Dropdown>
                                </HoverCard>)
                                :
                                (<TextInput disabled={bgImg.useCol} label="Background Url" value={typeof tmpBg !== "string" ? "" : tmpBg} onChange={(e)=>{setTmpBg(e.currentTarget.value) ; setBgImgErr(false)}} error={bgImgErr} className="w-[25svw]" leftSection={<ActionIcon disabled={bgImg.useCol} className="mr-1" onClick={handleBgUp} ><Icon icon={"material-symbols:upload"} /></ActionIcon>} />)
                            }
                            <Select disabled={bgImg.useCol} label="Background Size" value={bgImg.bgSize} className="w-[15vw]"
                                data={[{ value: 'cover', label: "Cover" }, { value: 'contain', label: "Contain" }, { value: 'auto', label: "Auto" }]}
                                onChange={(val, _) => setBgImg({ ...bgImg, bgSize: val })} allowDeselect={false} />
                            <HoverCard className="-ml-2">
                                    <HoverCard.Target>
                                        <Icon icon="material-symbols:info" height="24" />
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
                                        <Text c="cyan">Cover</Text>Scale the image until it fills the background, cropping if nessesary
                                        <Space h="md"/><Text c="lime">Contain</Text>Scale the image until it fits the background, without cropping
                                        <Space h="md"/><Text c="orange">Auto</Text>Use the image's original size
                                    </HoverCard.Dropdown>
                                </HoverCard>
                        </div>
                        <div className="flex items-center gap-5">
                            <ColorInput label="Background Gradient Start" value={bgImg.bgCol.start} onChange={(e) => setBgImg({ ...bgImg, bgCol: { ...bgImg.bgCol, start: e } })} format="rgba" className="w-[15vw]" />
                            <ColorInput label="Background Gradient End" value={bgImg.bgCol.end} onChange={(e) => setBgImg({ ...bgImg, bgCol: { ...bgImg.bgCol, end: e } })} format="rgba" className="w-[15svw]" />
                            <Text fw={500}>Gradient Angle</Text>
                            <AngleSlider value={bgImg.bgCol.deg} size={50} onChange={(e) => setBgImg({ ...bgImg, bgCol: { ...bgImg.bgCol, deg: e } })} step={15} formatLabel={(val) => `${val}°`} className="-ml-3" />
                        </div>
                    </div>
                    <div className="flex gap-1 mt-1 items-center">
                        <Switch checked={animation.active} onChange={(e) => setAnimation({ active: e.currentTarget.checked, duration: animation.duration })} /><Text>Animation </Text>
                    </div>
                    <Collapse in={animation.active} className={`flex border mt-1 p-1 items-center gap-5`}>
                        <NumberInput label="Duration (ms)" value={animation.duration} onChange={(e) => setAnimation({ active: animation.active, duration: e })} min={1} max={9999} className={`w-[10svw]`} />
                    </Collapse>
                    <NumberInput label="Corner Radius (px)" value={borderRadius} onChange={setBorderRadius} className="mt-1 w-[8vw]" />
                </Tabs.Panel>

                <Tabs.Panel value="apps">
                    <Accordion multiple >
                        <Accordion.Item value="clock" key="clock">
                            <Accordion.Control icon={<Icon icon="tabler:clock" />}><Text size="xl">Clock</Text></Accordion.Control>
                            <Accordion.Panel>
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2 items-center">
                                        <SegmentedControl value={clock.format12 ? "12" : "24"} data={[{ value: "12", label: "12 Hour" }, { value: "24", label: "24 Hour" }]} onChange={(val, _) => setClock({ ...clock, format12: val === "12" })} />
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Checkbox label="Leading 0 (12 hr. only)" checked={clock.lead0} onChange={(e) => setClock({ ...clock, lead0: e.currentTarget.checked })} />
                                        <Checkbox label="Show Seconds" checked={clock.showSec} onChange={(e) => setClock({ ...clock, showSec: e.currentTarget.checked })} />
                                        <Checkbox label="Pulse Separator" checked={clock.pulse} onChange={(e) => setClock({ ...clock, pulse: e.currentTarget.checked })} />
                                    </div>
                                    <div className="flex gap-2">
                                        <TextInput label="Separator" value={clock.separator} onChange={(e) => setClock({ ...clock, separator: e.currentTarget.value })} className="w-[5svw]" maxLength={1} placeholder=":" />
                                        <TextInput label="A.M. Text" value={clock.am} onChange={(e) => setClock({ ...clock, am: e.currentTarget.value })} className="w-[5svw]" placeholder="a.m." />
                                        <TextInput label="P.M. Text" value={clock.pm} onChange={(e) => setClock({ ...clock, pm: e.currentTarget.value })} className="w-[5svw]" placeholder="p.m." />
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
                                            <TextInput label="Your name" value={clock.greet.name} onChange={(e) => setClock({ ...clock, greet: { ...clock.greet, name: e.currentTarget.value } })} className="w-[10svw]" placeholder="User" />
                                            <TextInput label="Morning" value={clock.greet.morning} onChange={(e) => setClock({ ...clock, greet: { ...clock.greet, morning: e.currentTarget.value } })} className="w-[10svw]" placeholder="Good morning," />
                                            <TextInput label="Afternoon" value={clock.greet.afternoon} onChange={(e) => setClock({ ...clock, greet: { ...clock.greet, afternoon: e.currentTarget.value } })} className="w-[10svw]" placeholder="Good afternoon," />
                                            <TextInput label="Evening" value={clock.greet.evening} onChange={(e) => setClock({ ...clock, greet: { ...clock.greet, evening: e.currentTarget.value } })} className="w-[10svw]" placeholder="Good evening," />
                                            <TextInput label="Night" value={clock.greet.night} onChange={(e) => setClock({ ...clock, greet: { ...clock.greet, night: e.currentTarget.value } })} className="w-[10svw]" placeholder="Good night," />
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="date" key="date">
                            <Accordion.Control icon={<Icon icon="bi:calendar2-date" />}>
                                <div className="flex gap-1 items-center">
                                    <Text size="xl">Date</Text>
                                    <HoverCard>
                                        <HoverCard.Target>
                                            <Icon icon="material-symbols:info" height="20" />
                                        </HoverCard.Target>
                                        <HoverCard.Dropdown>
                                            <Text>Uses Dayjs format string (Advanced format also supported): <Anchor href="https://day.js.org/docs/en/display/format" target="_blank">day.js.org</Anchor></Text>
                                        </HoverCard.Dropdown>
                                    </HoverCard>
                                </div>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <TextInput label="Line 1" value={date.format1} onChange={(e) => setDate({ ...date, format1: e.currentTarget.value })} className="w-[15svw]" placeholder="dddd, MMM D" />
                                <TextInput label="Line 2" value={date.format2} onChange={(e) => setDate({ ...date, format2: e.currentTarget.value })} className="w-[15svw]" placeholder="YYYY" />
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="lists" key="lists">
                            <Accordion.Control icon={<Icon icon="material-symbols:list" />}>
                                <div className="flex gap-1 items-center">
                                    <Text size="xl">Lists</Text>
                                    <HoverCard>
                                        <HoverCard.Target>
                                            <Icon icon="material-symbols:info" height="20" />
                                        </HoverCard.Target>
                                        <HoverCard.Dropdown>
                                            <Text>Different lists are assigned to the page columns first, one by one</Text>
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
                        <Accordion.Item value="cards" key="cards">
                            <Accordion.Control icon={<Icon icon="material-symbols:cards" />}>
                                <div className="flex gap-1 items-center">
                                    <Text size="xl">Cards</Text>
                                    <HoverCard>
                                        <HoverCard.Target>
                                            <Icon icon="material-symbols:info" height="20" />
                                        </HoverCard.Target>
                                        <HoverCard.Dropdown>
                                            <Text>Different card boxes are assigned to the page columns first, one by one</Text>
                                        </HoverCard.Dropdown>
                                    </HoverCard>
                                </div>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Tabs value={cardFocus} onChange={handleCardTabsSelect} activateTabWithKeyboard={false} variant="pills">
                                    <Tabs.List>
                                        {cardTabs}
                                        <Tabs.Tab value="add" leftSection={<Icon icon="ic:sharp-plus" />} />
                                    </Tabs.List>
                                    {cardPanels}
                                </Tabs>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="weather" key="weather">
                            <Accordion.Control icon={<Icon icon="bi:cloud-sun" />}>
                                <Text size="xl">Weather</Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <NumberInput label="Latitude" rightSection={<></>} value={weather.lat} onChange={(e) => setWeather({ ...weather, lat: e })} min={-90} max={90} className="w-[15svw]" />
                                        <NumberInput label="Longitude" rightSection={<></>} value={weather.lon} onChange={(e) => setWeather({ ...weather, lon: e })} min={-180} max={180} className="w-[15svw]" />
                                    </div>
                                    <Collapse in={weather.provider === "p"}>
                                        <HoverCard>
                                            <HoverCard.Target>
                                                <TextInput label="Api Key" withAsterisk={weather.provider==="p"} value={weather.apiKey} onChange={(e) => setWeather({ ...weather, apiKey: e.currentTarget.value })} className="w-[20svw]" />
                                            </HoverCard.Target>
                                            <HoverCard.Dropdown>
                                                <Text>Only applicable when using Pirate Weather. Apply at <Anchor href="https://pirateweather.net/en/latest/">Pirate Weather Api</Anchor></Text>
                                            </HoverCard.Dropdown>
                                        </HoverCard>
                                    </Collapse>
                                    <div className="flex gap-2">
                                        <HoverCard>
                                            <HoverCard.Target>
                                                <SegmentedControl value={weather.provider} data={[{value: "o", label: "Open-Meteo"}, {value: "p", label: "Pirate Weather"}]} onChange={(val, _) => setWeather({ ...weather, provider: val })} />
                                            </HoverCard.Target>
                                            <HoverCard.Dropdown>
                                                <Text><Anchor href="https://open-meteo.com/" c="cyan">Open-Meteo</Anchor></Text>Free, max 10000 requests/day
                                                <Space h="md"/><Text><Anchor href="https://pirateweather.net/en/latest/" c="lime">Pirate Weather</Anchor></Text>Free with alerts available (needs Api key), max 10000 requests/month for free tier (~13 requests/hour)
                                            </HoverCard.Dropdown>
                                        </HoverCard>
                                        <SegmentedControl className="w-[7vw]" value={weather.f ? "F" : "C"} data={[{ value: "C", label: "°C" }, { value: "F", label: "°F" }]} onChange={(val, _) => setWeather({ ...weather, f: val === "F" })} />
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <NumberInput value={weather.interval} label="Update Interval (min)" onChange={(val) => setWeather({ ...weather, interval: val })} min={15} max={120} step={15} className="w-[15svw]" />
                                        <Checkbox label="Use Weather Icon" checked={weather.showIcon} onChange={(e) => setWeather({ ...weather, showIcon: e.currentTarget.checked })} />
                                    </div>
                                    <MultiSelect label="Weather notices" value={weather.items} onChange={(val) =>{ setWeather({ ...weather, items: val }) ; console.log(val)}} data={[
                                        { value: "feelsLike", label: "Apparent Temperature (Feels Like)"},
                                        { value: "weather", label: "Weather Condition"},
                                        { value: "alert", label: "Weather Alert"},
                                    ]} maxValues={2} placeholder="Up to 2 items" clearable className="w-[25svw]" />
                                    <Collapse in={weather.provider === "o"}>
                                        <a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>
                                    </Collapse>
                                </div>
                            </Accordion.Panel>
                        </Accordion.Item>                        
                    </Accordion>
                </Tabs.Panel>

                <Tabs.Panel value="about">
                    <Text>Version: {browser.runtime.getManifest().version}</Text>
                    <Text>Author: Margano <Anchor variant="text" c="white" href="https://github.com/Marganotvke" target="_blank"><Icon icon="mdi:github" /></Anchor></Text>
                    <Anchor href="https://github.com/Marganotvke/Supa-Bento" target="_blank">Project's Github Repository</Anchor>
                </Tabs.Panel>
            </Tabs>
            <Divider my="md" />
            <Modal keepMounted={false} opened={modalOpened} onClose={() => setModalOpened(false)} title="Reset Configuration" >
                <Divider my="md" />
                <Text className="mb-3" c="red">Are you sure you want to reset all settings? This will reset everything!</Text>
                <Group justify="space-between" >
                    <Button variant="filled" color="red" onClick={handleReset}>Yes</Button>
                    <Button variant="default" onClick={() => setModalOpened(false)}>No</Button>
                </Group>
            </Modal>
            <Dialog opened={dialogOpened} withCloseButton keepMounted={false} onClose={() => setDialogOpened(false)} withBorder size="lg" radius="md" >
                <Text>Config saved!</Text>
            </Dialog>
            <Dialog opened={submitDialogFailed} withCloseButton keepMounted={false} onClose={() => setSubmitDialogFailed(false)} withBorder size="lg" radius="md" >
                <Text c="red">Failed to save config: {submitFailContent}</Text>
            </Dialog>
            <Dialog opened={fetchFailed} withCloseButton keepMounted={false} onClose={() => setSubmitDialogFailed(false)} withBorder size="lg" radius="md" >
                <Text c="red">Failed to fetch settings!</Text>
            </Dialog>
            {
                ["layout", "theme", "apps"].includes(curOpt) ?
                <Group justify="space-between" >
                <Group>
                    <Button type="submit" variant="filled" onClick={handleSubmit}>Confirm</Button>
                    <Button variant="default" onClick={handleCancel}>Cancel</Button>
                </Group>
                <Button variant="filled" color="red" onClick={() => setModalOpened(true)}>Reset</Button>
                </Group>
                : 
                <></>
            }
            
        </form>

    )
}