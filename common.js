const FORMAT_MAX_COUNT = 9;

const DEFAULT_OPTIONS = {
  "defaultFormat": "1",
  "title1": "Markdown",
  "format1": "[{{text.s(\"\\\\[\",\"\\\\[\").s(\"\\\\]\",\"\\\\]\")}}]({{url.s(\"\\\\)\",\"%29\")}})",
  "title2": "reST",
  "format2": "`{{text}} <{{url}}>`_",
  "title3": "Text",
  "format3": "{{text}}\\n{{url}}",
  "title4": 'HTML',
  "format4": "<a href=\"{{url.s(\"\\\"\",\"&quot;\")}}\">{{text.s(\"<\",\"&lt;\")}}</a>",
  "title5": "LaTeX",
  "format5": "\\\\href\\{{{url}}\\}\\{{{text}}\\}",
  "title6": "",
  "format6": "",
  "title7": "",
  "format7": "",
  "title8": "",
  "format8": "",
  "title9": "",
  "format9": "",
  "createSubmenus": false
};

async function gettingOptions() {
  options = await browser.storage.sync.get(null);
  if (Object.keys(options).length === 0) {
    options = DEFAULT_OPTIONS;
  }
  return options;
}

function getFormatCount(options) {
  let i;
  for (i = 1; i <= 9; ++i) {
    let optTitle = options['title' + i];
    let optFormat = options['format' + i];
    if (optTitle === '' || optFormat === '') {
      break;
    }
  }
  return i - 1;
}

async function copyLinkToClipboard(format, linkUrl, linkText) {
  try {
    const results = await browser.tabs.executeScript({
      code: "typeof FormatLink_copyLinkToClipboard === 'function';",
    });
    // The content script's last expression will be true if the function
    // has been defined. If this is not the case, then we need to run
    // clipboard-helper.js to define function copyToClipboard.
    if (!results || results[0] !== true) {
      await browser.tabs.executeScript({
        file: "clipboard-helper.js",
      });
    }
    // clipboard-helper.js defines functions FormatLink_formatLinkAsText
    // and FormatLink_copyLinkToClipboard.
    const newline = browser.runtime.PlatformOs === 'win' ? '\r\n' : '\n';

    let code = 'FormatLink_formatLinkAsText(' + JSON.stringify(format) + ',' +
      JSON.stringify(newline) + ',' +
      (linkUrl ? JSON.stringify(linkUrl) + ',' : '') + 
      (linkText ? JSON.stringify(linkText) + ',' : '') + 
      ');';
    const result = await browser.tabs.executeScript({code});
    const formattedText = result[0];

    code = 'FormatLink_copyTextToClipboard(' + JSON.stringify(formattedText) + ');';
    await browser.tabs.executeScript({code});

    return formattedText;
  } catch (err) {
    // This could happen if the extension is not allowed to run code in
    // the page, for example if the tab is a privileged page.
    console.error('Failed to copy text: ' + err);
    alert('Failed to copy text: ' + err);
  }
}

function creatingContextMenuItem(props) {
  return new Promise((resolve, reject) => {
    browser.contextMenus.create(props, () => {
      const err = browser.runtime.lastError;
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function createContextMenus(options) {
  await browser.contextMenus.removeAll();
  if (options.createSubmenus) {
    const count = getFormatCount(options);
    for (let i = 0; i < count; i++) {
      let format = options['title' + (i + 1)];
      await creatingContextMenuItem({
        id: "format-link-format" + (i + 1),
        title: "as " + format,
        contexts: ["all"]
      });
    }
  } else {
    const defaultFormat = options['title' + options['defaultFormat']];
    await creatingContextMenuItem({
      id: "format-link-format-default",
      title: "Format Link as " + defaultFormat,
      contexts: ["all"]
    });
  }
}
