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
                iconType: false, // to use iconify or plain text(emoji)
                icon: "🎉", // must be string
                title: null // using title will override icon
            },
            {
                link: "https://example.com",
                iconType: false,
                icon: "🗻", 
                title: null
            },
            {
                link: "https://example.com",
                iconType: false,
                icon: null,
                title: "Card 3"
            },
            {
                link: "https://example.com",
                iconType: false,
                icon: null,
                title: "Card 4"
            },
            {
                link: "https://icon-sets.iconify.design/",
                iconType: true,
                icon: "ion:cloudy-night-outline",
                title: null
            },
            {
                link: "https://icon-sets.iconify.design/",
                iconType: true,
                icon: "lucide:tractor",
                title: null
            },
        ]
    },
]