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
    },[]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const localMemo = {title: memoTitle, content: memoContent};
        localStorage.setItem(memoName, JSON.stringify(localMemo));
    }

    return <>
        <form onSubmit={handleSubmit} style={{borderRadius: theme.borderRadius, backgroundColor: theme.app, color: theme.text.color.fg}}
            className={`md:flex ${isHidden ? "hidden" : "flex"} flex-col justify-center mx-2`}>
            <textarea id="memoTitle" name="memoTitle" onChange={(e)=>{setMemoTitle(e.target.value)}} style={{fontSize: theme.icon.size, resize: "none"}} className="h-[15%] text-center text-nowrap p-2 bg-transparent outline-none overflow-hidden" defaultValue={memoTitle} placeholder="Title here"/>
            <textarea id="memoContent" name="memoContent" onChange={(e)=>{setMemoContent(e.target.value)}} style={{fontSize: theme.text.size.itemText, resize: "none", backgroundColor: theme.app}} className="flex-1 min-w-0 p-2 outline-none" defaultValue={memoContent} placeholder="Write something here!"/>
            <button type="submit" style={{"--hover": theme.accent, "--hoverText": theme.text.color.sfg, "--bdRad": theme.borderRadius, fontSize: theme.text.size.itemText, ...animation}} className="hover:bg-[--hover] hover:text-[--hoverText] rounded-b-[--bdRad] flex-shrink text-end p-2">Save</button>
        </form>
    </>
}