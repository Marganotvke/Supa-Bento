import { Icon } from "@iconify/react";
import { defaultListConfig } from "../assets/defaultListConfig";
import { customListConfig } from "../assets/customListConfig";

function _inlineListItem(idx, item, config){
    const inlineIcon = item.iconType ? <Icon icon={item.icon} inline={true}/> : item.icon;
    const inlineTitle = item.title;

    return <a href={item.link} key={idx} 
        style={{transition: `${config.theme.animation.duration}ms ease-in-out`, '--hover': config.theme.accent, "--hoverText": config.theme.text.color.sfg, borderRadius: config.theme.borderRadius}} 
        className="p-2 w-[80%] min-w-0 items-center justify-center inline-flex hover:text-[--hoverText] hover:bg-[--hover]">
            {inlineIcon}{"\xa0"}{inlineTitle}
    </a>
}

function _listItem(idx, itemList, config){
    const listIcon = itemList.iconType ? <Icon icon={itemList.icon} /> : itemList.icon;
    const listTitle = itemList.title ? itemList.title : listIcon;

    return <div key={idx} style={{borderRadius: config.theme.borderRadius, backgroundColor: config.theme.list}}>
        <h1 style={{fontSize: config.theme.icon.size, color: config.theme.text.color.fg}}
            className="flex text-center items-center justify-center p-2 h-[15%]">
            {listTitle}
            </h1>
        <div key={idx} style={{fontSize: config.theme.text.size.itemText, "--text": config.theme.text.color.fg, transition: `${config.theme.animation.duration}ms ease-in-out`, gap: `${itemList.gap}rem`} }
        className="flex flex-col items-center justify-center text-[--text] p-2">
            {itemList.items.map((item, i) => {
                    return _inlineListItem(i, item, config)
                })
            }
        </div>
    </div>
}

export default function ListBox({idx, config}){
    const listConf = config.default ? defaultListConfig[idx] : customListConfig[idx];

    return <>
        <div style={{gridTemplateColumns: `repeat(${listConf.layout.cols}, 1fr)`, gap: `${listConf.layout.gap}rem`}}
            className="grid p-2 text-[--text] hover:text-[--hoverText]" >
            {listConf.content.map((list, i) => {
                    return _listItem(i, list, config)
                }
            )}
        </div>
    </>
}