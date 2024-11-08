import CellGen from './cellGen.jsx';
import ComponentGenerator from './compGen.jsx';

export default function LayoutGenerator({config}){
    const gridStyles = {"--gridCols": `repeat(${config.layout.cols/2}, 1fr)`, "--gridRows": `repeat(${config.layout.rows},1fr)`, "--gridColsMd": `repeat(${config.layout.cols}, 1fr)`, gap: `${config.layout.gap}rem`, fontFamily: config.theme.text.font};
    return <>
        <div className="px-[5%] py-[5%] md:px-[10%] lg:px-[15%] xl:px-[20%] h-screen w-screen grid grid-cols-[--gridCols] md:grid-cols-[--gridColsMd] grid-rows-[--gridRows] auto-cols-auto auto-rows-auto grid-flow-col" style={gridStyles}>
            <ComponentGenerator config={config}/>
        </div>
    </>
}