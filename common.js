const FORMAT_MAX_COUNT = 9;

const DEFAULT_OPTIONS = {
  "defaultFormat": "1",
  "title1": "Markdown",
  "format1": "[{{text.s(\"\\\\[\",\"\\\\[\").s(\"\\\\]\",\"\\\\]\")}}]({{url.s(\"\\\\(\",\"%28\").s(\"\\\\)\",\"%29\")}})",
  "html1": 0,
  "title2": "reST",
  "format2": "`{{text}} <{{url}}>`_",
  "html2": 0,
  "title3": "Text",
  "format3": "{{text}}\\n{{url}}",
  "html3": 0,
  "title4": 'HTML',
  "format4": "<a href=\"{{url.s(\"\\\"\",\"&quot;\")}}\">{{text.s(\"<\",\"&lt;\")}}</a>",
  "html4": 1,
  "title5": "LaTeX",
  "format5": "\\\\href\\{{{url}}\\}\\{{{text}}\\}",
  "html5": 0,
  "title6": "",
  "format6": "",
  "html6": 0,
  "title7": "",
  "format7": "",
  "html7": 0,
  "title8": "",
  "format8": "",
  "html8": 0,
  "title9": "",
  "format9": "",
  "html9": 0,
  "page_url_format": "",
  "selected_text_format": "",
  "text_format": "",
  "title_format": "",
  "url_format": "",
  "enableContextMenus": true,
  "createSubmenus": false
};

const VARIABLE_NAMES = [
  "page_url",
  "selected_text",
  "text",
  "title",
  "url",
];

async function gettingOptions() {
  let options = await browser.storage.sync.get(null);
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

async function copyLinkToClipboard(format, asHTML, options, linkUrl, linkText) {
  try {
    const results = await browser.tabs.executeScript({
      code: "typeof FormatLink_formatLink === 'function';",
    });
    // The content script's last expression will be true if the function
    // has been defined. If this is not the case, then we need to run
    // clipboard-helper.js to define functions FormatLink_formatLink
    // and FormatLink_copyHTMLToClipboard.
    if (!results || results[0] !== true) {
      await browser.tabs.executeScript({
        file: "clipboard-helper.js",
      });
    }

    const newline = browser.runtime.PlatformOs === 'win' ? '\r\n' : '\n';

    let code = 'FormatLink_formatLink(' + JSON.stringify(format) + ',' +
      JSON.stringify(options) + ',' +
      JSON.stringify(newline) + ',' +
      (linkUrl ? JSON.stringify(linkUrl) + ',' : '') + 
      (linkText ? JSON.stringify(linkText) + ',' : '') + 
      ');';
    const result = await browser.tabs.executeScript({code});
    const data = result[0];

    console.log('before copying to clipboard, data=', data, ', asHTML=', asHTML);
    if (asHTML) {
      await browser.tabs.executeScript({
        code: 'FormatLink_copyHTMLToClipboard(' + JSON.stringify(data) + ');'
      });
    } else {
      await navigator.clipboard.writeText(data);
    }
    console.log('clipboard successfully set by FormatLink');

    return data;
  } catch (err) {
    // This could happen if the extension is not allowed to run code in
    // the page, for example if the tab is a privileged page.
    console.error('Failed to copy text: ' + err);
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
  if (options.enableContextMenus) {
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
}
