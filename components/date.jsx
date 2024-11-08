import { format } from "date-fns"

export default function DateComponent({config, isHidden}) {
    const theme = config.theme;
    const now = new Date();
    const date = format(now, config.apps.date.format1)
    const date2 = config.apps.date.format2 ? format(now, config.apps.date.format2) : null;
    
    return <>
        <div className={`${isHidden? "hidden" : "flex"} md:flex flex-col p-2 justify-center items-center text-center text-nowrap leading-[1.2]`} style={{fontSize: theme.text.size.date, color: theme.text.color.fg}}>
            <h1>{date}</h1>
            {date2 ? <h1>{date2}</h1> : null}
        </div>
    </>
}