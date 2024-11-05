export default function CellGen({nums}){
    return <>
        {[...Array(nums)].map((_, i) => <a key={i} className={`p-2 justify-center items-center text-center align-middle bg-zinc-800 text-2xl text-white border border-white border-dashed rounded-md opacity-80`}>This is cell {i}</a>)}
    </>
}