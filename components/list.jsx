import { Icon } from "@iconify/react";
import { defaultListConfig } from "../assets/defaultListConfig";
import { customListConfig } from "../assets/customListConfig";

function _inlineListItem(idx, item, theme){
    const inlineIcon = item.iconType ? <Icon icon={item.icon} inline={true}/> : item.icon;
    const inlineTitle = item.title;
    const animation = theme.animation.active ? {transition: `${theme.animation.duration}ms ease-in-out`} : {transition: `none`};

    return <a href={item.link} key={idx} 
        style={{transition: `${theme.animation.duration}ms ease-in-out`, '--hover': theme.accent, "--hoverText": theme.text.color.sfg, borderRadius: theme.borderRadius, ...animation}} 
        className="w-[80%] p-2 min-w-0 items-center justify-center inline-flex hover:text-[--hoverText] hover:bg-[--hover]">
            {inlineIcon}{"\xa0"}{inlineTitle}
    </a>
}

function _listItem(idx, itemList, config, isHidden){
    const listIcon = itemList.iconType ? <Icon icon={itemList.icon} /> : itemList.icon;
    const listTitle = itemList.title ? itemList.title : listIcon;

    return <div key={idx} className="flex flex-col drop-shadow-lg" style={{borderRadius: config.theme.borderRadius, backgroundColor: config.theme.list}}>
        <h1 style={{fontSize: config.theme.icon.size, color: config.theme.text.color.fg}}
            className="flex flex-1 text-center items-center justify-center p-2 h-[15%]">
            {listTitle}
            </h1>
        <div key={idx} style={{fontSize: config.theme.text.size.itemText, "--text": config.theme.text.color.fg, gap: `${itemList.gap}rem`} }
        className="flex flex-1 flex-col items-center justify-center text-[--text] p-2">
            {itemList.items.map((item, i) => {
                    return _inlineListItem(i, item, config.theme)
                })
            }
        </div>
    </div>
}

export default function ListBox({idx, config ,isHidden}){
    const listConf = config.default ? defaultListConfig[idx] : customListConfig[idx];

    return <>
        <div style={{gridTemplateColumns: `repeat(${listConf.layout.cols}, 1fr)`, gap: `${listConf.layout.gap}rem`}}
            className={`md:grid ${isHidden? "hidden" : "grid"} py-2 px-4 text-[--text] hover:text-[--hoverText]`} >
            {listConf.content.map((list, i) => {
                    return _listItem(i, list, config)
                }
            )}
        </div>
    </>
}