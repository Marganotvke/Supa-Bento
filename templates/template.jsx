// Template component
// After finish editing the component, copy and paste the component to the components folder, and modify the compoGen.jsx

export default function Template({ config, // Config passed down from the parent
    isHidden // isHidden determines if the component should be hidden under specific screen width
}) {
    const theme = config.theme; // Get the theme from the config
    const appsConf = config.apps.template; // Get the apps configuration from the config
    
    
    return (
        <div className={`${isHidden ? "hidden" : ""}`}> {/*It is important to add isHidden to the component*/}
            <h2 className="text-center" style={{ fontSize: theme.text.size.primary }}>{appsConf.title}</h2>
            <div className="text-center" style={{ fontSize: theme.text.size.secondary }}>
                {appsConf.content}
            </div>
        </div>
    );
}
