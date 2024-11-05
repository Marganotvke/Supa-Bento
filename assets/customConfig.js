export const CustomCONFIG = {
    customActive: false,
    layout: {
        cols: 2,
        rows: 2,
        gapX: 3,
        gapY: 5
    },
    theme: {
        accent: "#57a0d9", // hover
        background: "#19171a",
        cards: "#201e21",
        text: {
            font: null,
            size: {
                primary: "12vh",
                secondary: "3vh",
                date: "8vh",
                list: "2vh"
            },
            color: {
                fg: "#d8dee9",
                sfg: "#2c292e" // secondary/hover
            }
        },
        icon: {
            size: "3vh",
            fill: "#d8dee9",
            sfill: "#2c292e" // secondary/hover
        },
        bgImg: {
            bgSize: "cover",
            bgCol: { // linear gradient, applies before bgimg
                start: "#000000",
                end: "#000000",
                opacity: 40
            }
        },
        animation: {
            active: true,
            duration: 200
        }
    }
};