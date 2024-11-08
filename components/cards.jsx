import { defaultCardsConfig } from "../assets/defaultCardsConfig";
import { customCardsConfig } from "../assets/customCardsConfig";
import { Icon } from "@iconify/react";

function _cards(idx, card, config){
    const theme = config.theme;
    const iconTitle = card.iconType ? <Icon icon={card.iconTitle} style={{fontSize: theme.icon.size}}/> : card.iconTitle;
    const animation = theme.animation.active ? {transition: `${theme.animation.duration}ms ease-in-out`} : {transition: `none`};


    return(
        <a href={card.link} key={idx} 
            style={{borderRadius: theme.borderRadius, fontSize: theme.text.size.itemText, "--text": theme.text.color.fg, '--hover': theme.accent, "--hoverText": theme.text.color.sfg, "--cardBg": theme.app, ...animation}} 
            className="bg-[--cardBg] hover:bg-[--hover] text-[--text] hover:text-[#2c292e] flex flex-row p-2 items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-1">
                {iconTitle}
        </a>
    )
}

export default function Cardbox({idx, config ,isHidden}){
    const cardConf = config.default ? defaultCardsConfig[idx] : customCardsConfig[idx];

    return <>
        <div className={`md:grid ${isHidden? "hidden" : "grid"} px-2 py-6`} style={{gridTemplateColumns: `repeat(${cardConf.layout.cols}, 1fr)`, gridTemplateRows: `repeat(${cardConf.layout.rows}, 1fr)`, gap: `${cardConf.layout.gap}rem`}}>
            {cardConf.content.map((card, i) => {
                    return  _cards(i, card, config)
                }
            )}
        </div>
    </>
}