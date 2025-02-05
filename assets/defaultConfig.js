export const DefaultCONFIG = {
    layout: {
        cols: 2, // in short width screens, cols will be halved, make sure it is a multiple of 2
        rows: 2,
        gap: 1,
        items:[ // apply cols first
            "clock",
            "cardbox",
            "memo",
            "listbox",
        ]
    },
    theme: {
        accent: "#57a0d9", // hover
        background: "#19171a",
        app: "#201e21",
        text: {
            font: null,
            size: {
                primary: "11vh",
                secondary: "4vh",
                date: "8vh",
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
        },
        date: {
            format1: "EEEE, LLL d", // this project uses date-fns format
            format2: "y"
        }
    },
    
    default: true,

    lists: [
        {
            layout: {
                cols: 2,
                gap: 2 //rem
            },
            content: [
                {
                    iconType: false, // use iconify icons or not
                    iconTitle: "List 1", // must be string
                    gap: 1, //rem
                    items: [
                        {
                            iconType: false, // icons here are inline
                            icon: "✔️",
                            title: "",
                            link: "#"
                        },
                        {
                            iconType: false, // icons here are inline
                            icon: "🕯",
                            title: "Item 2",
                            link: "#"
                        },
                        {
                            iconType: false, // icons here are inline
                            icon: "",
                            title: "Item 3",
                            link: "#"
                        },
                        {
                            iconType: false, // icons here are inline
                            icon: "🍲",
                            title: "Item 4",
                            link: "#"
                        },
                    ]
                },
                {
                    iconType: true, // use iconify icons or not
                    iconTitle: "lucide:gem", // must be string
                    gap: 1, //rem
                    items: [
                        {
                            iconType: true, // icons here are inline
                            icon: "iconoir:bright-star",
                            title: "Item 1",
                            link: "#"
                        },
                        {
                            iconType: true, // icons here are inline
                            icon: "proicons:checkmark-starburst",
                            title: "",
                            link: "#"
                        },
                        {
                            iconType: true, // icons here are inline
                            icon: "",
                            title: "Item 3",
                            link: "#"
                        },
                        {
                            iconType: true, // icons here are inline
                            icon: "eos-icons:hardware-circuit",
                            title: "Item 4",
                            link: "#"
                        },
                    ]
                },
            ]
        }
    ],

    cards: [
        {
            layout: {
                cols: 3,
                rows: 2,
                gap: 1 //rem
            },
            content: [
                {
                    link: "https://example.com",
                    iconType: false, // to use iconify or plain text(e.g. emoji)
                    iconTitle: "🎉" // must be string
                },
                {
                    link: "https://example.com",
                    iconType: false,
                    iconTitle: "🗻" 
                },
                {
                    link: "https://example.com",
                    iconType: false,
                    iconTitle: "Card 3"
                },
                {
                    link: "https://example.com",
                    iconType: false,
                    iconTitle: "Card 4"
                },
                {
                    link: "https://icon-sets.iconify.design/",
                    iconType: true,
                    iconTitle: "ion:cloudy-night-outline",
                },
                {
                    link: "https://icon-sets.iconify.design/",
                    iconType: true,
                    iconTitle: "lucide:tractor",
                },
            ]
        },
    ],

};