export const DefaultCONFIG = {
    layout: {
        cols: 2, // in short width screens, cols will be halved, make sure it is a multiple of 2
        rows: 2,
        gap: 1,
        items:[ // apply cols first
            "clock",
            "cardbox",
            "date",
            "listbox",
        ],
        skipIdx: [],
    },
    theme: {
        bg: "#19171a", // applies before bgImg load if applicable
        accent: "#57a0d9", // hover
        app: "#201e21",
        text: {
            font: '',
            isBold: false,
            size: {
                primary: "11vh",
                secondary: "4vh",
                date: "8vh",
                itemText: "2vh"
            },
            color: {
                fg: "#d8dee9",
                sfg: "#2c292e" // secondary/hover
            },
        },
        icon: {
            size: "3vh",
        },
        bgImg: {
            useCol: false, // Directly use bg color or bgImg
            img: "https://picsum.photos/1920/1080",
            imgIsUrl: true,
            bgSize: "cover",
            bgCol: { // linear gradient, applies before bgimg
                start: "rgba(0,0,0,0.4)",
                end: "rgba(0,0,0,0.4)",
                deg: 0
            }
        },
        animation: {
            active: true,
            duration: 200 //ms
        },
        borderRadius: 5, //px
    },
    apps: {
        clock: {
            format12: true, // 12 or 24, other number will be regarded as 24
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
            format1: "dddd, MMM D", // this project uses dayjs format
            format2: "YYYY"
        },

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
                        link: "https://iconify.design/",
                        iconType: true,
                        iconTitle: "ion:cloudy-night-outline",
                    },
                    {
                        link: "https://iconify.design/",
                        iconType: true,
                        iconTitle: "lucide:tractor",
                    },
                ]
            },
        ],

        weather: {
            provider: "o", // o for open meteo, p for pirate weather
            lat: 51.47699329881767,
            lon: -0.00004959142442448969,
            apiKey: "", //pirate weather
            showIcon: true, //weather icon
            f: false, //fahrenheit
            interval: 30, //minutes
            items: [ //feelsLike, alert, weather, max 2
                "feelsLike",
            ],
        }
    
    },
};