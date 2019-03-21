(async function() {
  try {
    browser.commands.onCommand.addListener(async (command) => {
      try {
        const prefix = 'copy-link-in-format';
        //let formatID;
        //if (command === '_execute_browser_action') {
        //  formatID = options.defaultFormat;
        if (command.startsWith(prefix)) {
          let formatID = command.substr(prefix.length);
          const options = await gettingOptions();
          const format = options['format' + formatID];
          await copyLinkToClipboard(format);
        }
      } catch (err) {
        console.error("FormatLink extension failed to copy URL to clipboard.", err);
      }
    });

    const options = await gettingOptions();
    await createContextMenus(options);
    browser.contextMenus.onClicked.addListener(async (info, tab) => {
      const prefix = "format-link-format";
      if (info.menuItemId.startsWith(prefix)) {
        try {
          const options = await gettingOptions();
          let formatID = info.menuItemId.substr(prefix.length);
          if (formatID === "-default") {
            formatID = options.defaultFormat;
          }
          const format = options['format' + formatID];
          await copyLinkToClipboard(format, info.linkUrl, info.linkText);
        } catch (err) {
          console.error("FormatLink extension failed to copy URL to clipboard.", err);
        }
      }
    });
  } catch (err) {
    console.error("failed to create context menu for FormatLink extension", err);
  };
})();
