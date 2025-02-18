import { useEffect, useState } from "react";
import { DefaultCONFIG } from '../../assets/defaultConfig';
import { storage } from "wxt/storage";
import { ActionIcon, Accordion, Anchor, AngleSlider, Button, Collapse, ColorInput, FileInput, HoverCard, Image, NumberInput, Select, Slider, Switch, Text, TextInput, Tabs, Checkbox, SegmentedControl, Group, Divider, Modal, Dialog } from "@mantine/core";
import { Icon } from '@iconify/react';

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

const ItemList = ({ idx, item, items, setItems, cols, rows, gap }) => (
    <select key={idx} style={{ "--hCalc": `${(80 / rows)}%`, "--wCalc": `${(80 / cols)}%`, "--gapCalc": `${gap / 6}vw` }} className={`${idx >= rows * cols ? "hidden" : null} h-[--hCalc] w-[--wCalc] m-[--gapCalc] bg-slate-700 rounded-md text-center`} value={item} onChange={(e) => { setItems([...items].map((x, i) => i === idx ? e.target.value : x)) }}>
        <option value="clock">Clock</option>
        <option value="cardbox">Cards</option>
        <option value="memo">Memo (local only)</option>
        <option value="listbox">Lists</option>
        <option value="date">Date</option>
    </select>
);

const ListPanel = ({ list, idx, lists, setLists }) => (
    <Tabs.Panel key={idx} value={`list${idx}`} >
        <Text fw={500}>Layout</Text>
        <div className="flex gap-2 border p-1 items-center mb-1">
            <NumberInput label="Sublists" value={list.layout.cols} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, layout: { ...x.layout, cols: e } } : x))} min={1} max={2} step={1} className="w-[7svw]" />
            <NumberInput label="Gap (rem)" value={list.layout.gap} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, layout: { ...x.layout, gap: e } } : x))} min={0} max={6} step={1} className="w-[7svw]" />
        </div>
        <Text fw={500}>Sublists</Text>
        <div className="flex gap-2">
            <SublistPanel list={list} idx={idx} sublistIdx={0} lists={lists} setLists={setLists} />
            <SublistPanel list={list} idx={idx} sublistIdx={1} lists={lists} setLists={setLists} />
        </div>
    </Tabs.Panel>
);

const SublistPanel = ({ list, idx, sublistIdx, lists, setLists }) => (
    <div className={`${list.layout.cols >= sublistIdx + 1 ? "flex" : "hidden"} flex-col gap-2 border p-1 justify-center m-1`}>
        <div className="flex gap-2 items-center">
            <Checkbox label="Use Iconify Icon as sublist name?" checked={list.content[sublistIdx].iconType} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === sublistIdx ? { ...y, iconType: e.currentTarget.checked } : y) } : x))} />
            <HoverCard>
                <HoverCard.Target>
                    <Icon icon="material-symbols:info" height="20" />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Anchor href="https://icon-sets.iconify.design/" target="_blank">Iconify Icons</Anchor>
                    <br />Disable to use emoji
                </HoverCard.Dropdown>
            </HoverCard>
        </div>
        <div className="flex gap-1">
            <TextInput label={`Sublist ${sublistIdx + 1} ${list.content[sublistIdx].iconType ? "Icon" : ""} Name`} value={list.content[sublistIdx].iconTitle} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === sublistIdx ? { ...y, iconTitle: e.currentTarget.value } : y) } : x))} className="w-[15svw]" />
            <NumberInput label="Gap (rem)" value={list.content[sublistIdx].gap} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === sublistIdx ? { ...y, gap: e } : y) } : x))} min={0} max={6} step={1} className="w-[7svw]" />
        </div>
        {list.content[sublistIdx].items.map((item, iidx) => (
            <div key={`lsi${idx}${iidx}`} className="flex gap-1">
                <div className="flex flex-col gap-2 items-center w-[5svw]">
                    <Text size={"sm"} className="text-wrap text-center">Use Iconify</Text>
                    <Switch checked={item.iconType} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === sublistIdx ? { ...y, items: y.items.map((z, k) => k === iidx ? { ...z, iconType: e.currentTarget.checked } : z) } : y) } : x))} />
                </div>
                <TextInput label={`Item ${iidx + 1} Icon`} value={item.icon} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === sublistIdx ? { ...y, items: y.items.map((z, k) => k === iidx ? { ...z, icon: e.currentTarget.value } : z) } : y) } : x))} className="w-[10svw]" />
                <TextInput label={`Item ${iidx + 1} Title`} value={item.title} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === sublistIdx ? { ...y, items: y.items.map((z, k) => k === iidx ? { ...z, title: e.currentTarget.value } : z) } : y) } : x))} className="w-[10svw]" />
                <TextInput label={`Item ${iidx + 1} Link`} value={item.link} onChange={(e) => setLists([...lists].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === sublistIdx ? { ...y, items: y.items.map((z, k) => k === iidx ? { ...z, link: e.currentTarget.value } : z) } : y) } : x))} className="w-[10svw]" />
            </div>
        ))}
    </div>
);

export default function Options() {
    const [modalOpened, setModalOpened] = useState(false);
    const [dialogOpened, setDialogOpened] = useState(false);
    const [fetchFailed, setFetchFailed] = useState(false);
    const [submitDialogFailed, setSubmitDialogFailed] = useState(false);
    const [submitFailContent, setSubmitFailContent] = useState("");

    //see default config
    //layout
    const [cols, setCols] = useState(2);
    const [rows, setRows] = useState(2);
    const [gap, setGap] = useState(1);
    const [items, setItems] = useState(["clock", "cardbox", "memo", "listbox"]);

    //theme
    const [accent, setAccent] = useState("#57a0d9");
    const [app, setApp] = useState("#201e21");
    const [text, setText] = useState({
        font: "",
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

    const usrConfigStore = storage.defineItem("sync:usrConfig", {
        fallback: DefaultCONFIG,
        init: () => { return DefaultCONFIG },
    })

    const fetchUsrConfigs = async () => {
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

        } catch (e) {
            console.error(e);
            setFetchFailed(true);
        }
    };

    useEffect(() => {
        fetchUsrConfigs();
    }, [])

    useEffect(() => {
        setItems(_arrLenCh(items, cols * rows));
    }, [cols, rows])

    const _itemsLists = (idx, item) => (
        <ItemList idx={idx} item={item} items={items} setItems={setItems} cols={cols} rows={rows} gap={gap} />
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
        setLists([...lists].filter((_, idx) => idx !== parseInt(listFocus.slice(-1))));
        setListFocus(lists.length > 1 ? `list${lists.length - 2}` : ``);
    }

    const handleDeleteCard = (e) => {
        e.preventDefault();
        setCards([...cards].filter((_, idx) => idx !== parseInt(cardFocus.slice(-1))));
        setCardFocus(cards.length > 1 ? `card${cards.length - 2}` : ``);
    }

    const cardTabs = cards
        .map((card, idx) => {
            return <Tabs.Tab key={idx} value={`card${idx}`} rightSection={<div onClick={handleDeleteCard} className="hover:bg-slate-800 p-1 rounded-md -m-1"><Icon icon="material-symbols:close" /></div>}>{`Cards ${idx + 1}`}</Tabs.Tab>;
        });

    const pillTabs = lists
        .map((list, idx) => {
            return <Tabs.Tab key={idx} value={`list${idx}`} rightSection={<div onClick={handleDeleteList} className="hover:bg-slate-800 p-1 -m-1 rounded-md"><Icon icon="material-symbols:close" /></div>}>{`List ${idx + 1}`}</Tabs.Tab>;
        });

    const pillsPanels = lists.map((list, idx) => (
        <ListPanel key={idx} list={list} idx={idx} lists={lists} setLists={setLists} />
    ));

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
                                <br />Disable to use emoji
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </div>
                    <div className="flex flex-col gap-2 border p-1 mb-1">
                        {card.content.map((item, iidx) => {
                            if (iidx >= card.layout.cols * card.layout.rows) { return; }
                            return <div key={`ci${idx}${iidx}`} className="flex gap-1">
                                <div className="flex flex-col gap-2 items-center w-[5svw]">
                                    <Text size={"sm"} className="text-wrap text-center">Use Iconify</Text>
                                    <Switch checked={item.iconType} onChange={(e) => setCards([...cards].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === iidx ? { ...y, iconType: e.currentTarget.checked } : y) } : x))} />
                                </div>
                                <TextInput label={`Card ${iidx + 1} ${item.iconType ? "Icon" : "Text"}`} value={item.iconTitle} onChange={(e) => setCards([...cards].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === iidx ? { ...y, title: e.currentTarget.value } : y) } : x))} className="w-[10svw]" />
                                <TextInput label={`Card ${iidx + 1} Link`} value={item.link} onChange={(e) => setCards([...cards].map((x, i) => i === idx ? { ...x, content: x.content.map((y, j) => j === iidx ? { ...y, link: e.currentTarget.value } : y) } : x))} className="w-[10svw]" />
                            </div>
                        })}
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
                items: items
            },
            theme: {
                accent: accent,
                app: app,
                text: text,
                icon: icon,
                bgImg: bgImg,
                animation: animation,
                borderRadius: borderRadius
            },
            apps: {
                clock: clock,
                date: date,
                lists: lists,
                cards: cards
            }
        }
        const res = await usrConfigStore.setValue(packagedConfig).catch((err) => err);
        if (typeof res === "undefined") {
            console.log("User saved changes");
            setDialogOpened(true);
            setTimeout(() => setDialogOpened(false), 3000);
        } else {
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
                        <NumberInput label="Columns" value={cols} onChange={setCols} min={2} max={4} step={2} className="w-[5svw]" />
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
                        <Text size="sm">Make sure to add the corresponding configs within the Apps tab if you are adding more than one list/cards!</Text>
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="theme">
                    <div className="flex gap-5 mt-1">
                        <ColorInput label="Accent Color" description="Used when hovering" value={accent} onChange={setAccent} className="w-[15svw]" />
                        <ColorInput label="App Color" description="Used for apps' background" value={app} onChange={setApp} className="w-[15svw]" />
                    </div>
                    <Text fw={500}>Text Properties</Text>
                    <div className="border p-1 justify-center items-center mb-1">
                        <TextInput label="Font Family" value={text.font} onChange={(e) => setText({ ...text, font: e.currentTarget.value })} className="w-[15svw]" placeholder="Default" />
                        <div className="flex gap-5 mt-1">
                            <TextInput label="Primary Size" value={text.size.primary} onChange={(e) => setText({ ...text, size: { ...text.size, primary: e.currentTarget.value } })} className="w-[8svw]" />
                            <TextInput label="Secondary Size" value={text.size.secondary} onChange={(e) => setText({ ...text, size: { ...text.size, secondary: e.currentTarget.value } })} className="w-[8svw]" />
                            <TextInput label="Date Size" value={text.size.date} onChange={(e) => setText({ ...text, size: { ...text.size, date: e.currentTarget.value } })} className="w-[8svw]" />
                            <TextInput label="Item Text Size" value={text.size.itemText} onChange={(e) => setText({ ...text, size: { ...text.size, itemText: e.currentTarget.value } })} className="w-[8svw]" />
                        </div>
                        <div className="flex gap-5 mt-1">
                            <ColorInput label="Text Color" value={text.color.fg} onChange={(e) => setText({ ...text, color: { ...text.color, fg: e } })} className="w-[15svw]" />
                            <ColorInput label="Hover Color" value={text.color.sfg} onChange={(e) => setText({ ...text, color: { ...text.color, sfg: e } })} className="w-[15svw]" />
                        </div>
                    </div>
                    <TextInput label="Icon Size" value={icon.size} onChange={(e) => setIcon({ size: e.currentTarget.value })} className="w-[7svw]" />
                    <div className="flex gap-1 mt-1">
                        <Text fw={500}>Background</Text><Text className="italic">(color applies before background image)</Text>
                    </div>
                    <div className="flex flex-col border p-1 gap-1 mb-1">
                        <div className="flex items-center gap-5">
                            <Image src={bgImg.img} className="w-[15vw] h-[10vh] object-cover" />
                            <FileInput label="Background Image" value={typeof tmpBg === "string" ? null : tmpBg} onChange={(e) => { setTmpBg(e) }} className="w-[15svw]" placeholder="Click to choose" accept="image/png,image/jpeg" clearable leftSection={<ActionIcon className="mr-1" onClick={() => {
                                var tmp;
                                if (!tmpBg) { return; } else { tmp = tmpBg; }
                                setBgImg({ ...bgImg, img: typeof tmp === "string" ? tmp : URL.createObjectURL(tmp) });
                                setTmpBg(null);
                            }} ><Icon icon={"material-symbols:upload"} /></ActionIcon>} />
                            <Select label="Background Size" value={bgImg.bgSize} className="w-[15vw]"
                                data={[{ value: 'cover', label: "Cover" }, { value: 'contain', label: "Contain" }, { value: 'auto', label: "Auto" }]}
                                onChange={(val, _) => setBgImg({ ...bgImg, bgSize: val })} allowDeselect={false} />
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
                    <NumberInput label="Border Radius (px)" value={borderRadius} onChange={setBorderRadius} className="mt-1 w-[8vw]" />
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
                                            <Text>Uses Dayjs format string: <Anchor href="https://day.js.org/docs/en/display/format" target="_blank">day.js.org</Anchor></Text>
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
                    </Accordion>
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
            <Group justify="space-between" >
                <Group>
                    <Button type="submit" variant="filled" onClick={handleSubmit}>Confirm</Button>
                    <Button variant="default" onClick={handleCancel}>Cancel</Button>
                </Group>
                <Button variant="filled" color="red" onClick={() => setModalOpened(true)}>Reset</Button>
            </Group>
        </form>

    )
}