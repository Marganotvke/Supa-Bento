import { useState, useEffect } from "react";
import {storage} from "#imports";

export default function Memo({idx, config, isHidden}){
    const theme = config.theme;
    const animation = theme.animation.active ? {transition: `${theme.animation.duration}ms ease-in-out`} : {transition: `none`};
    const [memoTitle, setMemoTitle] = useState("");
    const [memoContent, setMemoContent] = useState("");
    const memoName = `memo_${idx}`;

    const usrMemo = storage.defineItem(`local:${memoName}`, {
        fallback: {title: "", content: ""},
    });
    
    useEffect(() => {
        const getMemoStorage = async () => {
            try {
                var localMemo;
                localMemo = await usrMemo.getValue()
                return localMemo ? localMemo : {title: "", content: ""};
            }catch(e){
                console.log("Error parsing memo data: ", e);
            }
        }
        getMemoStorage().then(memo => {
            setMemoTitle(memo.title);
            setMemoContent(memo.content);
            console.log(`${!memo.title && !memo.content ? `No memo found for memo ${idx}` : "Memo data loaded for memo " + idx}`);
        });
    },[]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!memoTitle && !memoContent){
            console.log("No memo data to save for", memoName);
            return;
        }
        const localMemo = {title: memoTitle, content: memoContent};
        await usrMemo.setValue(localMemo);
        console.log("Memo data saved", localMemo);
    }

    const handleReset = async (e) => {
        e.preventDefault();
        await usrMemo.removeValue();
        setMemoTitle("");
        setMemoContent("");
        console.log("Memo data cleared for", memoName);
    }

    return <>
        <form onSubmit={handleSubmit} onReset={handleReset} style={{borderRadius: `${theme.borderRadius}px`, backgroundColor: theme.app, color: theme.text.color.fg, ...animation}}
            className={`md:flex ${isHidden ? "hidden" : "flex"} flex-col justify-center mx-2 hover:-translate-y-1`}>
            <textarea id="memoTitle" name="memoTitle" maxLength="25" onChange={(e)=>{setMemoTitle(e.target.value)}} style={{fontSize: theme.icon.size, resize: "none"}} className="h-[15%] text-center text-nowrap p-2 bg-transparent outline-none overflow-hidden" placeholder="Title here" value={memoTitle}/>
            <textarea id="memoContent" name="memoContent" onChange={(e)=>{setMemoContent(e.target.value)}} style={{fontSize: theme.text.size.itemText, resize: "none", backgroundColor: theme.app}} className="flex-1 min-w-0 p-2 outline-none" placeholder="Write something here!" value={memoContent}/>
            <div className="flex flex-row">
                <button type="submit" style={{"--hover": theme.accent, "--hoverText": theme.text.color.sfg, "--bdRad": `${theme.borderRadius}px`, fontSize: theme.text.size.itemText, ...animation}} className="hover:bg-[--hover] hover:text-[--hoverText] rounded-bl-[--bdRad] flex-1 text-start p-2">Save</button>
                <button type="reset" style={{"--hover": theme.accent, "--hoverText": theme.text.color.sfg, "--bdRad": `${theme.borderRadius}px`, fontSize: theme.text.size.itemText, ...animation}} className="hover:bg-[--hover] hover:text-[--hoverText] rounded-br-[--bdRad] flex-1 text-end p-2">Clear</button>
            </div>
        </form>
    </>
}