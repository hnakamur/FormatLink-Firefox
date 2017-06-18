gettingOptions().then(options => {
  createContextMenus(options);

  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.startsWith("format-link-format")) {
      gettingOptions().then(options => {
        var formatID = info.menuItemId.substr("format-link-format".length);
        if (formatID === "-default") {
          formatID = options["defaultFormat"];
        }
        var format = options['format' + formatID];
        var url = info.linkUrl ? info.linkUrl : info.pageUrl;
        var title = tab.title;
        var text = info.selectionText ? info.selectionText : tab.title;
        var formattedText = formatURL(format , url, title, text);

        // The example will show how data can be copied, but since background
        // pages cannot directly write to the clipboard, we will run a content
        // script that copies the actual content.

        // clipboard-helper.js defines function copyToClipboard.
        const code = "copyToClipboard(" + JSON.stringify(formattedText) + ");";

        browser.tabs.executeScript(tab.id, {
          code: "typeof copyToClipboard === 'function';",
        }).then(results => {
          // The content script's last expression will be true if the function
          // has been defined. If this is not the case, then we need to run
          // clipboard-helper.js to define function copyToClipboard.
          if (!results || results[0] !== true) {
            return browser.tabs.executeScript(tab.id, {
              file: "clipboard-helper.js",
            });
          }
        }).then(() => {
          return browser.tabs.executeScript(tab.id, {
            code,
          });
        }).then(() => {
          var ctrlPressed = info.modifiers.includes('Ctrl');
          if (ctrlPressed) {
            saveDefaultFormat(formatID);
          }
        }).catch(error => {
          // This could happen if the extension is not allowed to run code in
          // the page, for example if the tab is a privileged page.
          console.error("Failed to copy text: " + error);
        });
      });
    }
  });
});
