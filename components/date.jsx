import dayjs from 'dayjs';

export default function Dates({config, isHidden, span}) {
    const theme = config.theme;
    const appConf = config.apps.date;
    const date = appConf.format1 ? dayjs().format(appConf.format1).toString() : null;
    const date2 = appConf.format2 ? dayjs().format(appConf.format2).toString() : null;

    return (
        <div className={`${isHidden? "hidden" : "flex"} md:flex flex-col p-2 justify-center items-center text-center text-nowrap leading-[1.2] ${span ? "col-span-4" : ""}`} style={{fontSize: theme.text.size.date, color: theme.text.color.fg}}>
            {date ? <h1>{date}</h1> : null}
            {date2 ? <h1>{date2}</h1> : null}
        </div>
    )
}