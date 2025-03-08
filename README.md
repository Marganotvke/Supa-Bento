![Supa-Bento](readmeImgSrc\supabentoi.png)
🍱 A minimalist, elegant and hackable newtab extension, with easily customizable widgets.

# Features
- Clean and minimalist
- Customizable layouts and widget placements
- Easy to customize color themes and widgets with ui interface
- [Iconify](https://iconify.design/) support provides icon customizability
- Automatically adapting to screen sizes
- Easy to implement extensive customization such as custom widgets with modular javascript files

# Install
1. Visit the [releases](https://github.com/Marganotvke/Supa-Bento/releases) page
2. Download the latest extension package (.crx for chrome, .xpi for firefox)
3. Open your extension page, usually located within settings or similar pages
4. Drag the package into the page
5. Open a newtab
6. If a dialog popped up asking if you allow this extension to change your newtabs page, accept it **(make sure it is this extension!)**
7. Visit the extension settings page to customize your newtab!

# Build
1. Clone this repository
   ```shell
   git clone https://github.com/Marganotvke/Supa-Bento.git
   ```
2. Install requirements
    ```shell
    npm install
    ```
3. Run build/zip
   ```shell
   npm run dev
   ```

# Customization
After activating the extension, you can access the options page by clicking the extension icon at the extension bar, then select the gear icon, or visit the manage extension page, then finding the option within the extension's page, of which the location is browser specific. 
## Basic Customization
### Layout
![Layout options](readmeImgSrc\layout\chrome-extension___gljccpbnhlcldmbblooehdigbbgchich_options.html.png)
This page consists of all the layout options, where you can customize the general layout, such as the amount of cells and what widgets to be placed inside a cell.
![Selected layout options](readmeImgSrc\layout\layoutOptSelect.png)
Here, you can select wanted widgets for any cell. Some widgets will span across multiple cells, of which affected cells will be locked.
![Clock widget spanning 2 cells](readmeImgSrc\layout\chrome-extension___gljccpbnhlcldmbblooehdigbbgchich_newtab.html5.png)
> [!IMPORTANT]
> Some widgets here need seperate configurations (e.g. cards). If you added more than one of the same kind into the layout, make sure you have properly configured them within the [Widgets](#widgets) page.
### Theme
![Theme options](readmeImgSrc\theme\chrome-extension___gljccpbnhlcldmbblooehdigbbgchich_options.html6.png)
This page consists of all the theming options, from texts to background and even animation.
#### **Font Family**
You enter a [font family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) within this field. In short, enter the name of the font that you want to use, that the browser can see (e.g. installed on your computer). It defaults to whatever font your browser is currently using.
#### **Text Size and Icon Size**
Accepts any [CSS compliant unit](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units#numbers_lengths_and_percentages).
- **Primary** controls the largest texts size
- **Secondary** controls the secondary texts of some widgets
- **Date** controls the date widget's text size
- **Item** controls the size of item text
- **Icon** controls the size of icons
> [!NOTE]
> Icons inline of lists items are controlled by item text size, not icon size!
#### **Background**
You can choose to use image as background, or use the bg color in the above.
<br />
You can also choose either using an URL or uploading a single image for the background.
> [!IMPORTANT]
> If you choose to upload an image, make sure it is not over 10 MB, and please understand that it will not be synced across devices!

The gradient colors are a kind of color filter to put on top of the background. Besides the colors, you can specify the angle of the gradient by modifying the Gradient Angle parameter.
### Widgets
![Widget options](readmeImgSrc\widgets\chrome-extension___gljccpbnhlcldmbblooehdigbbgchich_options.htmlw.png)
Configs for every widget that can be quickly customized is within this page.
#### **Clock**
![Clock options](readmeImgSrc\widgets\clockOpt.png)
The clock follows your local time. You can modify the greentings below the clock as well.
![Clock widget](readmeImgSrc\widgets\clockWid.png)
#### **Date**
![Date options](readmeImgSrc\widgets\dateOpt.png)
You can modify the format of dates using [Day.js formatted string](https://day.js.org/docs/en/display/format). You can also remove one of the lines by leaving them empty.
#### **Lists**
![Lists options](readmeImgSrc\widgets\listOpt.png)
Here, every list have their seperate configs tab. If you added more than one list within the layout tab, make sure to click the "+" icon here to add another config for your list.<br /><br />
List configs are applied one by one, columns first.
##### Layout
Every list have a layout you can also modify. You can choose how many sublists there is to a list. At most, you can select 2 sublists for a single list.
##### Sublist configs
Here, you control every single item within a sublist.
![sublist](readmeImgSrc\widgets\sublist.png)
- **Sublist name**: The name of the sublist. You can choose to type in text (and emojis), or use [Iconify icons](https://iconify.design/). Iconify is a tool to use open source icons within the app. Currently there are over 200k icons within the tool, of which you can choose any as your icon. Make sure to only have one icon string for a single field, since the app cannot detect more than one iconify icon strings at the same time.
- **Item icon**: The inline icon of the respective item. You can choose to use Iconify icons, or emojis, or even other texts. This co-exists with the title of the item. Do keep in mind that the size is controlled by item text size, not icon size.
- **Item title**: The text of the item.
- **Item link**: The link for that specific item.

#### **Cards**
![cards options](readmeImgSrc\widgets\cardOpt.png)
Also known as buttons or cardbox, these are cards that you directly click.
<br/><br/>Similar to lists, every cardbox have their seperate configs tab. If you added more than one within the layout tab, make sure to click the "+" icon here to add another config.<br /><br />
Cards configs are applied one by one, columns first.
![cards](readmeImgSrc\widgets\cards.png)
##### Card options
- **Text**: The text/icon you want to place within the card. You can either place text/emojis, or choose to use [Iconify icons](https://iconify.design/). Iconify is a tool to use open source icons within the app. Currently there are over 200k icons within the tool, of which you can choose any as your icon. Make sure to only have one icon string for a single field, since the app cannot detect more than one iconify icon strings at the same time.
- **Link**: The link for that item.
#### **Weather**
![weather options](readmeImgSrc\widgets\weatherOpt.png)
Here, you can configure how the weather widget behaves.
##### Latitude and Longitude
Enter any the lat&lon of any location you want to see the weather of. You can easily find such information online.
##### Service Provider
Currently, this widget supports two service providers, and you can choose to use anyone of them.
- [**Open-Meteo**](https://open-meteo.com/): A free and open-source weather api provider. It provides 10000 requests per day, which is very generous. Most importantly, it does not require an API key to run. It supports temperature, basic weather information, as well as apparent temperature (feels like).
- [**Pirate Weather**](https://pirateweather.net/en/latest/): An open-source provider, but an API key is needed to access it. It provides 10000 per month on free tier, or ~13 per hour. It supports everything open-meteo provides, plus local alerts, which is useful if you need the alerts (e.g. tornado, snow storm). It uses a different sets of icons (animated!) if you enabled the use of weather icons.
##### Update interval
Everytime the page is opened, the widget checks if the current time after last fetching data from the provider is within this timeframe. If not, it will call and fetch new data back to the app. You can manually type in the update interval (in minutes). However, it is recommended to keep it within the default range (15min - 120min) so that you won't get rate limited (especially if you are using Pirate Weather API).
###### Weather notices
![weather notices](readmeImgSrc\widgets\weaNoticeOpt.png)<br/>
In this field, you can choose which weather notices to be placed below the temperature. You can choose up to two lines. There are three options:

![Feels Like](readmeImgSrc\widgets\feels.png)
- **Apparent Temperature (Feels Like)**: Temperature adjusted for wind and humidity. In open-meteo, it is based on the source data, or this formula:
    > AT=Ta+.348∗e−.70∗ws+.70∗(Q/ws+10)−4.25

    For Pirate Weather, they follow this formula:

    > AT = Ta + 0.33 × rh / 100 × 6.105 × exp(17.27 × Ta / (237.7 + Ta)) − 0.70 × ws − 4.00

![Weather condition](readmeImgSrc\widgets\cond.png)
- **Weather Condition**: The current condition of the weather. If you enabled weather icons, they display the same thing. If this line is not chosen, you can also hover above the weather icon to see the condition.
  
![Weather alert](readmeImgSrc\widgets\alert.png)
- **Weather Alert**: Only available when using Pirate Weather provider. It shows the brief description of any alerts within the specified location.

# Advanced Customization
If you plan to modify the code and more, make sure you have backup your config first. Most configs are stored in the extension's sync storage. Memos and background images are stored within the extension's local storage.
## Directly editing the config file
It is stored within the assets, called defaultConfig.js. You can modify this file directly as it overwrites the defaultConfigs. You can also add configurations for your custom widgets (if added). Make sure to reset your current configs so the app will use your modified default config file instead of settings from the temporary storage. Clear this extension's cache as well if needed.
## Adding custom widgets
You can add new widgets with the following steps:
1. Add a new .jsx file that consists of the component needed to the folder [components](components). Make sure it is written with React. TailwindCSS is also used, so you can use tailwind for styling. You can refer to the [template file](templates\template.jsx) for more detail.
2. Navigate to the components generator file [compGen.jsx](components\compGen.jsx) and add you component to that file. Make sure you have added both the imports and the component to the generating tree.
3. Modify the config files. Refer to [Directly editing the config file](#directly-editing-the-config-file).
4. Rebuild and run the extension.
## Anything else
After all, this is built as an extension for browsers. If you want to, adding more entrypoints such as background scripts, implementing other extension features etc. are also available. Refer to [WXT Docs](https://wxt.dev/guide/introduction.html) for more information.

# Special Thanks
Thank you [Miguel Ávila](https://github.com/migueravila) for the amazing [Bento](https://github.com/migueravila/Bento) and its contributors, which inspired me to do this project.
