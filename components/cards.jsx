import { defaultCardsConfig } from "../assets/defaultCardsConfig";
import { customCardsConfig } from "../assets/customCardsConfig";
import { Icon } from "@iconify/react";

function _cards(idx, card, config){
    const icon = card.iconType ? <Icon icon={card.icon} style={{fontSize: config.theme.icon.size}}/> : card.icon;
    const cardContent = card.title ? card.title : icon;

    return(
        <a href={card.link} key={idx} 
            style={{borderRadius: config.theme.borderRadius, fontSize: config.theme.text.size.itemText, "--text": config.theme.text.color.fg, transition: `${config.theme.animation.duration}ms ease-in-out`, '--hover': config.theme.accent, "--hoverText": config.theme.text.color.sfg, "--cardBg": config.theme.cards}} 
            className="bg-[--cardBg] hover:bg-[--hover] text-[--text] hover:text-[#2c292e] flex flex-row p-2 items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-1">
                {cardContent}
        </a>
    )
}

export default function Cardbox({idx, config}){
    const cardConf = config.default ? defaultCardsConfig[idx] : customCardsConfig[idx];

    return <>
        <div className="grid px-2 py-6" style={{gridTemplateColumns: `repeat(${cardConf.layout.cols}, 1fr)`, gridTemplateRows: `repeat(${cardConf.layout.rows}, 1fr)`, gap: `${cardConf.layout.gap}rem`}}>
            {cardConf.content.map((card, i) => {
                    return  _cards(i, card, config)
                }
            )}
        </div>
    </>
}