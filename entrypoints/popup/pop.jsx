import { Icon } from "@iconify-icon/react"

export default function Popup() {

    const openOptions = async () => {
        await browser.runtime.openOptionsPage()
    };


    return (
        <div className="min-w-[10rem] flex flex-col items-center justify-center bg-gray-800 overflow-auto">
            <h1 className="text-lg text-center rounded bg-gray-700 my-2 mx-1 p-2 text-gray-200">Supa-Bento 🍱</h1>
            <div className="text-lg text-gray-200 flex rounded bg-gray-700 my-2 mx-1 p-2 gap-2">
                <a href="https://github.com/Marganotvke/Supa-Bento"><Icon icon="mdi:github" /></a>
                <a className="w-[1px] bg-gray-200" />
                <a onClick={openOptions}><Icon icon="mdi:cog" /></a>
            </div>
        </div>
    )
}``