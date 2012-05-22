# Format Link for Chrome

## Why do I need it?
To format the link of the active tab instantly to use in Markdown, Textile or other formats.

## How to use
Press the toolbar icon of "Format Link".  When a popup opens, texts are automatically copied to the clipboard.

Also you can change the format with selecting the format in the dropdown list. And if you press the "Save as Default" button, you can make it as default.

## Flexible settings
You can modify formats in [Tools] -> [Extensions] -> Clik "Options" link in "Format Link" Extension.
In format settings, you can use the mini template language.

* {{variable}}
    * variable = title / url
    * No spaces are allowed.
* {{variable.s("foo","bar")}}
    * Which means variable.replace(new RegExp("foo", 'g'), "bar")
    * You can use escape character \ in strings.
    * You must escape the first argument for string and regexp.
      For example, .s("\\[","\\[") means replacing [ with \\[
    * You can chain multiple .s("foo","bar")
* You can use the escape character \
* Other characters are treated as literal strings.

Here are examples:

* Markdown
    * ```[{{title.s("\\[","\\[").s("\\]","\\]")}}]({{url.s("\\)","%29")}})```
* Redmine Textile
    * ```"{{title.s("\"","&quot;").s("\\[","&#91;")}}":{{url}}```
* HTML
    * ```<a href="{{url.s("\"","&quot;")}}">{{title.s("<","&lt;")}}</a>```
* Text
    * ```{{title}}\n{{url}}```

## License
MIT License.
Source codes are hosted at [Github](https://github.com/hnakamur/FormatLink-Chrome)

## Credits

### Icon
I synthesized two icons (a pencil and a link) to produce ```icon.png```.

* A pencil icon from [Onebit free icon set](http://www.icojoy.com/articles/44/) © 2010 [Khodjaev Stanislav](http://www.icojoy.com/), used under a License: These icons are free to use in any kind of commercial or non-commercial project unlimited times.
* A link icon from [Bremen icon set](http://pc.de/icons/#Bremen) © 2010 [Patricia Clausnitzer](http://pc.de/icons/), used under a [Creative Commons Attribution 3.0 License](hhttp://creativecommons.org/licenses/by/3.0/)

### Extension
This extension "Format Link" are inspired by extensions below:

* [Chrome Web Store - Create Link](https://chrome.google.com/webstore/detail/gcmghdmnkfdbncmnmlkkglmnnhagajbm) by [ku (KUMAGAI Kentaro)](https://github.com/ku)
* [Make Link :: Add-ons for Firefox](https://addons.mozilla.org/en-US/firefox/addon/make-link/) by [Rory Parle](https://addons.mozilla.org/en-US/firefox/user/90/)
