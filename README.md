# Format Link for Firefox

## Why do I need it?
To format the link of the active tab instantly to use in Markdown, reST, HTML, Text, Textile or other formats.

## How to use

### context menu
To copy the URL, use the context menu.
Open the context menu and select the "Format Link as XXX" menu item.
XXX in the menu item label changes as you select the default format with the radio button in the popup page for the toolbar button.

### toolbar button
The popup page is shown when you press the toolbar button of "Format Link".
You can change the format by clicking a radio button for each format which you registered in the options page.

## Flexible settings
You can modify formats in [Tools] -> [Extensions] -> Clik "Options" link in "Format Link" Extension.
In format settings, you can use the mini template language.

* {{variable}}
    * variable = title / url / text
    * The value of variable `title` is the HTML page title.
    * The value of variable `text` is the selected text if some text is selected,
      the link text if you open the context menu over a link,
      or the page URL if no text is selected and you open the context menu not over a link.
    * The value of the variable `url` is the link URL if selection contains a link.
      Otherwise, the value of variable `url` is the HTML page URL.
    * No spaces are allowed between variable name and braces.
* {{variable.s("foo","bar")}}
    * Which means variable.replace(new RegExp("foo", 'g'), "bar")
    * You can use escape character \ in strings.
    * You must escape the first argument for string and regexp.
      For example, .s("\\[","\\[") means replacing [ with \\[
    * You can chain multiple .s("foo","bar")
* You can use the escape character \ in strings.
* Other characters are treated as literal strings.

Here are examples:

* Markdown

```
[{{text.s("\\[","\\[").s("\\]","\\]")}}]({{url.s("\\)","%29")}})
```

* reST

```
{{text}} <{{url}}>`_
```

* HTML

```
<a href="{{url.s("\"","&quot;")}}">{{text.s("<","&lt;")}}</a>
```

* Text

```
{{text}}\n{{url}}
```

* Redmine Texitile

```
"{{title.s("\"","&quot;").s("\\[","&#91;")}}":{{url}}
```

## KNOWN LIMITATIONS

* Due to web extension API limitations, this extension does not work as users might expect.
* When you right click on a link without selecting text manually, {{text}} becomes the text of the *first* link of the same URL.
  * If there is another link of the same URL, {{text}} may be different than the text of you actually selected.
* Due to security reason, the limitation becomes severer on about: pages and addons.mozilla.org pages.
  * You cannot use the context menus nor the keyboard shortcut on those pages.
  * You can use the toolbar to copy the URL, but the text always become the page title even if you select some text.

## License
MIT License.
Source codes are hosted at [Github](https://github.com/hnakamur/FormatLink-Firefox)

## Credits

### Icon
I synthesized two icons (a pencil and a link) to produce ```icon.png```.

* A pencil icon from [Onebit free icon set](http://www.icojoy.com/articles/44/) © 2010 [Khodjaev Stanislav](http://www.icojoy.com/), used under a License: These icons are free to use in any kind of commercial or non-commercial project unlimited times.
* A link icon from [Bremen icon set](http://pc.de/icons/#Bremen) © 2010 [Patricia Clausnitzer](http://pc.de/icons/), used under a [Creative Commons Attribution 3.0 License](hhttp://creativecommons.org/licenses/by/3.0/)

### Extension
This extension "Format Link" are inspired by extensions below:

* [Chrome Web Store - Create Link](https://chrome.google.com/webstore/detail/gcmghdmnkfdbncmnmlkkglmnnhagajbm) by [ku (KUMAGAI Kentaro)](https://github.com/ku)
* [Make Link :: Add-ons for Firefox](https://addons.mozilla.org/en-US/firefox/addon/make-link/) by [Rory Parle](https://addons.mozilla.org/en-US/firefox/user/90/)
