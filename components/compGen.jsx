import Clock from "./clock";
import Cells from "./cellGen";
import Cardbox from "./cards";
import ListBox from "./list";

export default function ComponentGenerator({config}){
    const components = config.layout.items;
    var cardCounts = 0;
    var listCounts = 0;
    const thresh = config.layout.cols/2;

    return <>
        {components.map((comp, i) => {
            const isHidden = i > thresh;
                    switch (comp) {
                        case "clock":
                            return <Clock key={i} config={config} isHidden={isHidden}/>
                        case "cardbox":
                            return <Cardbox key={i} idx={cardCounts++} config={config} isHidden={isHidden}/>
                        case "listbox":
                            return <ListBox key={i} idx={listCounts++} config={config} isHidden={isHidden}/>
                        default:
                            return <Cells key={i} idx={i} isHidden={isHidden}/>
                    }
        })}
    </>
}