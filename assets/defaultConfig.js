export const DefaultCONFIG = {
    layout: {
        cols: 2,
        rows: 2,
        gap: 1,
        items:[
            "clock",
            "cardbox",
            "memo",
            "listbox"
        ]
    },
    theme: {
        accent: "#57a0d9", // hover
        background: "#19171a",
        app: "#201e21",
        text: {
            font: null,
            size: { //vh
                primary: "12vh",
                secondary: "4vh",
                date: null,
                itemText: "2vh"
            },
            color: {
                fg: "#d8dee9",
                sfg: "#2c292e" // secondary/hover
            }
        },
        icon: {
            size: "3vh",
        },
        bgImg: {
            bgSize: "cover",
            bgCol: { // linear gradient, applies before bgimg
                start: "rgba(0,0,0,0.4)",
                end: "rgba(0,0,0,0.4)"
            }
        },
        animation: {
            active: true,
            duration: 200 //ms
        },
        borderRadius: "5px"
    },
    apps: {
        clock: {
            format: 12, // 12 or 24, other number will be regarded as 24
            showSec: false, // this overrides separator pulsing
            separator: ":",
            pulse: true,
            am: "a.m.",
            pm: "p.m.",
            greet: {
                name: "User",
                morning: "Good morning, ",
                afternoon: "Good afternoon, ",
                evening: "Good evening, ",
                night: "Good night, "
            }
        }
    },
    default: true
};