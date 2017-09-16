async function formatURLAndCopyToClipboard(format, url, title, selectedText) {
  var formattedText = formatURL(format, url, title, selectedText);
  await copyTextToClipboard(formattedText);
  return browser.storage.local.set({
    lastCopied: {
      format: format,
      url: url,
      title: title,
      selectedText: selectedText,
      formattedText: formattedText
    }
  });
}

async function copyTextToClipboard(text) {
  try {
    var results = await browser.tabs.executeScript({
      code: "typeof copyToClipboard === 'function';",
    });
    // The content script's last expression will be true if the function
    // has been defined. If this is not the case, then we need to run
    // clipboard-helper.js to define function copyToClipboard.
    if (!results || results[0] !== true) {
      await browser.tabs.executeScript({
        file: "clipboard-helper.js",
      });
    }
    // clipboard-helper.js defines function copyToClipboard.
    const code = "copyToClipboard(" + JSON.stringify(text) + ");";
    return browser.tabs.executeScript({code});
  } catch (err) {
    // This could happen if the extension is not allowed to run code in
    // the page, for example if the tab is a privileged page.
    console.error("Failed to copy text: " + err);
  }
}

async function tryToGetLinkSelectionText(tab, url, text) {
  if (text) {
    return text;
  }
  var response = await browser.tabs.sendMessage(tab.id, {"method": "getSelection"});
  var selText = response.selection;
  if (selText) {
    return selText;
  }
  response = await browser.tabs.executeScript(tab.id, {
    code: `
      var text = '';
      var links = document.querySelectorAll('a');
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.href === "${url}") {
          text = link.innerText.trim();
          break
        }
      }
      text;
    `
  });
  return response[0];
}

function createContextMenu(defaultFormat) {
  return new Promise((resolve, reject) => {
    browser.contextMenus.create({
      id: "format-link-format-default",
      title: "Format Link as " + defaultFormat,
      contexts: ["link", "selection", "page"],
    },
    () => {
      var err = browser.runtime.lastError;
      if (err) {
        reject(err);
      } else {
        browser.contextMenus.onClicked.addListener(async (info, tab) => {
          if (info.menuItemId === "format-link-format-default") {
            try {
              var options = await gettingOptions();
              var formatID = options["defaultFormat"];
              var format = options['format' + formatID];
              var url = info.linkUrl ? info.linkUrl : info.pageUrl;
              var title = tab.title;
              var text = info.selectionText;
              var selText = await tryToGetLinkSelectionText(tab, url, text);
              return formatURLAndCopyToClipboard(format, url, title, selText);
            } catch (err) {
              console.error("FormatLink extension failed to copy URL to clipboard.", err);
            }
          }
        });
        resolve();
      }
    })
  });
}

gettingOptions().then(async options => {
  try {
    var defaultFormat = options['title' + (options['defaultFormat'] || "1")];
    await createContextMenu(defaultFormat);
  } catch (err) {
    console.error("failed to create context menu", err);
  };
});
