export const defaultListConfig = [
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
]