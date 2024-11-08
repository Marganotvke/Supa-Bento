export const defaultCardsConfig = [
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
]