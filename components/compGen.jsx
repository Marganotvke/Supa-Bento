import { Clock } from "./clock";

export default function ComponentGenerator({config}){
    return <>
        <Clock config={config}/>
    </>
}