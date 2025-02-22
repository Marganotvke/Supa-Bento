import { Icon } from "@iconify/react";
import { storage } from "wxt/storage";

function _inlineListElements(idx, item, theme, anim){
    const inlineIcon = item.iconType ? <Icon icon={item.icon} inline={true}/> : item.icon;
    const inlineTitle = item.title;

    return <a href={item.link} key={idx} 
        style={{'--hover': theme.accent, "--hoverText": theme.text.color.sfg, borderRadius: `${theme.borderRadius}px`, ...anim}} 
        className={`w-[80%] p-2 min-w-0 items-center justify-center inline-flex hover:text-[--hoverText] hover:bg-[--hover] ${theme.text.isBold ? "font-semibold" : ""}`}>
            {inlineIcon}{"\xa0"}{inlineTitle}
    </a>
}

function _listItem(idx, itemList, config, anim){
    const theme = config.theme;
    const listIconTitle = itemList.iconType ? <Icon icon={itemList.iconTitle} /> : itemList.iconTitle;

    return <div key={idx} className={`flex flex-col drop-shadow-lg hover:-translate-y-1 `} style={{borderRadius: theme.borderRadius, backgroundColor: theme.app, ...anim}}>
        <h1 style={{fontSize: theme.icon.size, color: theme.text.color.fg}}
            className="flex flex-1 text-center items-center justify-center p-2 h-[15%]">
            {listIconTitle}
            </h1>
        <div key={idx} style={{fontSize: theme.text.size.itemText, "--text": theme.text.color.fg, gap: `${itemList.gap}rem`} }
        className="flex flex-1 flex-col items-center justify-center text-[--text] p-2">
            {itemList.items.map((item, i) => {
                    return _inlineListElements(i, item, theme)
                })
            }
        </div>
    </div>
}

export default function ListBox({idx, config ,isHidden}){
    const theme = config.theme;
    let listConf;
    if (config.apps.lists[idx]){
        listConf = config.apps.lists[idx];
    }else{
        listConf = config.apps.lists[0];
        console.log(`Cannot find list config for list ${idx}`);
    }
    const animation = theme.animation.active ? {transition: `${theme.animation.duration}ms ease-in-out`} : {transition: `none`};

    return <>
        <div style={{gridTemplateColumns: `repeat(${listConf.layout.cols}, 1fr)`, gap: `${listConf.layout.gap}rem`}}
            className={`md:grid ${isHidden? "hidden" : "grid"} py-2 px-2 text-[--text] hover:text-[--hoverText]`} >
            {listConf.content.map((list, i) => {
                    return _listItem(i, list, config, animation)
                }
            )}
        </div>
    </>
}