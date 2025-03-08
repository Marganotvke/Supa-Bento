import { Icon } from "@iconify-icon/react"

export default function Popup() {

    const openOptions = async () => {
        await browser.runtime.openOptionsPage()
    };


    return (
        <div className="min-w-[10rem] flex flex-col items-center justify-center bg-gray-800 overflow-auto">
            <h1 className="text-lg text-center rounded bg-gray-700 my-2 mx-1 p-2 text-gray-200">Supa-Bento 🍱</h1>
            <div className="text-lg text-gray-200 flex rounded bg-gray-700 my-2 mx-1 gap-2">
                <a className="hover:bg-gray-500 p-2 rounded-l" href="https://github.com/Marganotvke/Supa-Bento" target="_blank"><Icon icon="mdi:github" /></a>
                <a className="w-[1px] -mx-2 my-2 bg-gray-200" />
                <a className="hover:bg-gray-500 p-2 rounded-r" onClick={openOptions}><Icon icon="mdi:cog" /></a>
            </div>
        </div>
    )
}``