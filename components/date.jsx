import dayjs from 'dayjs';

export default function Dates({config, isHidden, span}) {
    const theme = config.theme;
    const date = dayjs().format(config.apps.date.format1).toString();
    const date2 = config.apps.date.format2 ? dayjs().format(config.apps.date.format2).toString() : null;


    return (
        <div className={`${isHidden? "hidden" : "flex"} md:flex flex-col p-2 justify-center items-center text-center text-nowrap leading-[1.2] font-light ${span ? "font-semibold" : ""}`} style={{fontSize: theme.text.size.date, color: theme.text.color.fg}}>
            <h1>{date}</h1>
            {date2 ? <h1>{date2}</h1> : null}
        </div>
    )
}