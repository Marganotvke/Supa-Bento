import { useEffect, useState } from "react";
import {DefaultCONFIG} from '../../assets/defaultConfig'
import {storage} from "wxt/storage";

function _arrLenCh(arr, len){
    //helper function to change array length
    const arrLen = arr.length;
    const tmpArr = [...arr];
    tmpArr.length = len;
    if (arrLen < len){
        return tmpArr.fill("clock", arrLen-len);
    }else{
        return tmpArr;
    }
}

export default function Options() {
    //layout
    const [cols, setCols] = useState(2);
    const [rows, setRows] = useState(2);
    const [gap, setGap] = useState(1);
    const [items, setItems] = useState(["clock","cardbox","memo","listbox"]);

    //theme
    const [accent, setAccent] = useState("#57a0d9");
    const [background, setBackground] = useState("#19171a");
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
                sfg: "#2c292e" // secondary/hover
            }
        });
    const [icon, setIcon] = useState({size: "3vh"});
    const [bgImg, setBgImg] = useState({
        bgSize: "cover",
        bgCol: { // linear gradient, applies before bgimg
            start: "rgba(0,0,0,0.4)",
            end: "rgba(0,0,0,0.4)"
        }
    });
    const [animation, setAnimation] = useState({
        active: true,
        duration: 200 //ms
    });
    const [borderRadius, setBorderRadius] = useState("5px");

    //apps

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
                setBackground(fetchedConfig.theme?.background || DefaultCONFIG.theme.background);
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

    const _itemsLists = (idx, item) => {
        return (
            <select style={{"--hCalc": `${(80/rows)}%`, "--wCalc": `${(85/cols)}%`, "--gapCalc": `${gap}px`}} className="h-[--hCalc] w-[--wCalc] m-[--gapCalc] bg-gray-200" value={item} onChange={(e)=>{setItems( [...items].map((x, i) => i === idx ? e.target.value : x) )}}>
                <option value="clock">Clock</option>
                <option value="cardbox">Cards</option>
                <option value="memo">Memo</option>
                <option value="listbox">Lists</option>
                <option value="date">Date</option>
            </select>
        )
    }

    const handleColsRowsChange = (e, type) => {
        if (type){
            setRows(e.target.value);
        }else{
            setCols(e.target.value);
        }
    }

    return (
        <>
            <div className="flex flex-col bg-slate-100 text-gray-900 p-2">
                <h1 className="text-2xl">Options</h1>
                <hr className="h-px my-2 bg-gray-300 border-0"/>
                <h3 className="text-lg">Layout</h3>
                <label className="text-sm">
                    Columns{" "}<input type="number" value={cols} onChange={(e)=>{handleColsRowsChange(e, 0)}} min="2" max="4" step="2" className="w-10 border rounded border-slate-500 p-1" placeholder="2" />
                    {" "}Rows{" "}<input type="number" value={rows} onChange={(e)=>{handleColsRowsChange(e, 1)}} min="1" max="3" className="w-10 border rounded border-slate-500 p-1" placeholder="2" />
                    {" "}Gap{" "}<input type="range" value={gap} onChange={(e)=>setGap(e.target.value)} min="0" max="6" step="1" className="p-1" placeholder="1" />
                    <br />Items<h6 className="text-[2.5vw] inline"> (Actual gap is bigger)</h6>
                    <div className="h-[50vw] flex flex-col flex-wrap border border-slate-500 justify-center items-center mb-1">
                        {items.map((item, idx) => _itemsLists(idx, item))}
                    </div>
                </label>
                <hr className="h-px my-2 bg-gray-300 border-0"/>
                <h3 className="text-lg">Theme</h3>
                <label className="text-sm">
                    Accent Colour <input type="color" value={accent} onChange={(e)=>setAccent(e.target.value)} className="border rounded border-slate-500 p-1 m-1" />
                    {" "}Background Colour <input type="color" value={background} onChange={(e)=>setBackground(e.target.value)} className="border rounded border-slate-500 p-1 m-1" />
                    <br />App Colour <input type="color" value={app} onChange={(e)=>setApp(e.target.value)} className="border rounded border-slate-500 p-1 m-1" />
                    <br />Text Colour<div className="border border-slate-500 p-1 justify-center items-center mb-1">
                        Font<input type="text" value={text.font} onChange={(e)=>setText({...text, font: e.target.value})} className="w-10 h-6 border rounded border-slate-500 p-1 m-1" />
                        {" "}Primary Size<input type="text" value={text.size.primary} onChange={(e)=>setText({...text, size: {...text.size, primary: e.target.value}})} className="w-10 h-6 border border-slate-500 p-1 m-1" />
                        <br />Secondary Size<input type="text" value={text.size.secondary} onChange={(e)=>setText({...text, size: {...text.size, secondary: e.target.value}})} className="w-10 h-6 border border-slate-500 p-1 m-1" />
                        {" "}Date Size<input type="text" value={text.size.date} onChange={(e)=>setText({...text, size: {...text.size, size: {...text.size, date: e.target.value}}})} className="w-10 h-6 border border-slate-500 p-1 m-1" />
                        <br />Item Text Size<input type="text" value={text.size.itemText} onChange={(e)=>setText({...text, size: {...text.size, itemText: e.target.value}})} className="w-10 h-6 border border-slate-500 p-1 m-1" />
                        {" "}Text Colour<input type="color" value={text.color.fg} onChange={(e)=>setText({...text, color: {...text.color, fg: e.target.value}})} className="border rounded border-slate-500 p-1 m-1" />
                        <br />Hover Colour<input type="color" value={text.color.sfg} onChange={(e)=>setText({...text, color: {...text.color, sfg: e.target.value}})} className="border rounded border-slate-500 p-1 m-1" />
                    </div>
                    Icon Size <input type="text" value={icon.size} onChange={(e)=>setIcon({size: e.target.value})} className="w-10 h-6 border rounded border-slate-500 p-1 m-1" />
                    <br />Background<h6 className="text-[2.5vw] inline"> (Colour is linear gradient, applies before background image)</h6><div className="border border-slate-500 p-1 justify-center items-center mb-1">
                        Background Size <select className="border rounded border-slate-500">
                            <option value="cover">Cover</option>
                            <option value="contain">Contain</option>
                            <option value="auto">Auto</option>
                            <option value="100% 100%">Full</option>
                        </select>
                        <br />Background Colour Start<input type="color" value={bgImg.bgCol.start} onChange={(e)=>setBgImg({...bgImg, bgCol: {...bgImg.bgCol, start: e.target.value}})} className="border rounded border-slate-500 p-1 m-1" />
                        <br />Background Colour End<input type="color" value={bgImg.bgCol.end} onChange={(e)=>setBgImg({...bgImg, bgCol: {...bgImg.bgCol, end: e.target.value}})} className="border rounded border-slate-500 p-1 m-1" />
                    </div>
                    Animation Active <input type="checkbox" checked={animation.active} onChange={(e)=>setAnimation({active: e.target.checked, duration: animation.duration})} className="border rounded border-slate-500 p-1 m-1" />
                    <br /> Animation Duration (ms)<input type="number" value={animation.duration} onChange={(e)=>setAnimation({active: animation.active, duration: e.target.value})} className="w-[3.5rem] h-6 border rounded border-slate-500 p-1 m-1" min="1" max="9999" />
                </label>
                <hr className="h-px my-2 bg-gray-300 border-0"/>
            </div>
        </>
    )
}