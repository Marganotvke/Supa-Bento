import Clock from "./clock";
import Cardbox from "./cards";
import ListBox from "./lists";
import Memo from "./memo";
import Dates from "./date";
import Empty from "./empty";
import Weather from "./weather";
// import Template from "./template"; // Import the component

export default function ComponentGenerator({config}){
    const components = config.layout.items;
    var cardCounts = 0;
    var listCounts = 0;
    var memoCounts = 0;
    const thresh = Math.ceil(config.layout.cols/2);

    return <>
        {components.map((comp, i) => {
            const isHidden = i > thresh;
            if (i >= config.layout.cols*config.layout.rows) return;
                    switch (comp) {
                        case "clock":
                            return <Clock key={i} config={config} isHidden={isHidden}/>
                        case "clock2":
                            return <Clock key={i} config={config} isHidden={isHidden} span/>
                        case "cardbox":
                            return <Cardbox key={i} idx={cardCounts++} config={config} isHidden={isHidden}/>
                        case "listbox":
                            return <ListBox key={i} idx={listCounts++} config={config} isHidden={isHidden}/>
                        case "memo":
                            return <Memo key={i} idx={memoCounts++} config={config} isHidden={isHidden}/>
                        case "date":
                            return <Dates key={i} config={config} isHidden={isHidden}/>
                        case "date2":
                            return <Dates key={i} config={config} isHidden={isHidden} span/>
                        case "weather":
                            return <Weather key={i} config={config} isHidden={isHidden}/>
                        // case "template":
                        //     return <Template key={i} config={config} isHidden={isHidden}/>
                        default:
                            return <Empty key={i} isHidden={isHidden} />
                    }
        })}
    </>
}