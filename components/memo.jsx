import { useState, useEffect } from "react";

export default function Memo({idx, config, isHidden}){
    const theme = config.theme;
    const animation = theme.animation.active ? {transition: `${theme.animation.duration}ms ease-in-out`} : {transition: `none`};
    const [memoTitle, setMemoTitle] = useState("");
    const [memoContent, setMemoContent] = useState("");
    const memoName = `memo_${idx}`;
    var memo = {title: "", content: ""};
    
    useEffect(() => {
        try {
            const localMemo = JSON.parse(localStorage.getItem(memoName));
            memo = localMemo ? localMemo : memo;

        }catch(e){
            console.log("Error parsing memo data: ", e);
        }
        setMemoTitle(memo.title);
        setMemoContent(memo.content);
        console.log(`${!memo.title && !memo.content ? `No memo found for memo ${idx}` : "Memo data loaded for memo " + idx}`);
    },[]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!memo.title && !memo.content){
            console.log("No memo data to save for", memoName);
            return;
        }
        const localMemo = {title: memoTitle, content: memoContent};
        localStorage.setItem(memoName, JSON.stringify(localMemo));
        console.log("Memo data saved", localMemo);
    }

    const handleReset = (e) => {
        e.preventDefault();
        localStorage.removeItem(memoName);
        setMemoTitle("");
        setMemoContent("");
        memo = {title: "", content: ""};
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