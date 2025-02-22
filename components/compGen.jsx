import Clock from "./clock";
import Cardbox from "./cards";
import ListBox from "./lists";
import Memo from "./memo";
import Dates from "./date";
import Empty from "./empty";

export default function ComponentGenerator({config}){
    const components = config.layout.items;
    var cardCounts = 0;
    var listCounts = 0;
    var memoCounts = 0;
    var thresh = 0;
    if(config.layout.cols % 2 !== 0){
        thresh = (config.layout.cols - 1)/2;
        console.log(`Your layout has an odd number of columns (${config.layout.cols}). Make sure it is a multiple of 2.`);
    }else{
        thresh = config.layout.cols/2;
    }

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
                            default:
                            return <Empty key={i} isHidden={isHidden} />
                    }
        })}
    </>
}