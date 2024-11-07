import { Clock } from "./clock";
import Cells from "./cellGen";
import Cardbox from "./cards";
import ListBox from "./list";

export default function ComponentGenerator({config}){
    const components = config.layout.items;
    var cardCounts = 0;
    var listCounts = 0;

    return <>
        {components.map((comp, i) => {
                    switch (comp) {
                        case "clock":
                            return <Clock key={i} config={config}/>
                        case "cardbox":
                            return <Cardbox key={i} idx={cardCounts++} config={config}/>
                        case "listbox":
                            return <ListBox key={i} idx={listCounts++} config={config}/>
                        default:
                            return <Cells key={i} idx={i}/>
                    }
        })}
    </>
}