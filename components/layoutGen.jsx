import CellGen from './cellGen.jsx';
import ComponentGenerator from './compGen.jsx';

export default function LayoutGenerator({config}){
    const gridStyles = {gridTemplateColumns: `repeat(${config.layout.cols}, 1fr)`, gridTemplateRows: `repeat(${config.layout.rows}, 1fr)`, gap: `${config.layout.gap}rem`};
    return <>
        <div className="px-[5%] py-[5%] md:px-[10%] lg:px-[15%] xl:px-[20%] h-screen w-screen grid auto-cols-auto auto-rows-auto" style={gridStyles}>
            <ComponentGenerator config={config}/>
        </div>
    </>
}