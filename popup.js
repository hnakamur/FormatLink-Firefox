function populateFields(options, url, title, selectedText) {
  populateFormatGroup(options, url, title, selectedText);
  var formatId = options['defaultFormat'];
  populateText(options, formatId, url, title, selectedText);
}

function populateFormatGroup(options, url, title, selectedText) {
  var defaultFormat = options['defaultFormat'];
  var radios = [];
  var cnt = getFormatCount(options);
  var group = document.getElementById('formatGroup');
  while (group.hasChildNodes()) {
    group.removeChild(group.childNodes[0]);
  }
  for (var i = 1; i <= cnt; ++i) {
    var radioId = 'format' + i;

    var btn = document.createElement('input');
    btn.setAttribute('type', 'radio');
    btn.setAttribute('name', 'fomrat');
    btn.setAttribute('id', radioId);
    btn.setAttribute('value', i);
    if (i == defaultFormat) {
      btn.setAttribute('checked', 'checked');
    }
    btn.addEventListener('click', async e => {
      var formatId = e.target.value;
      populateText(options, formatId, url, title, selectedText);
      var defaultName = options['title' + formatId];
      try {
        await saveDefaultFormat(formatId);
        await updateContextMenu(defaultName);
      } catch (err) {
        console.error("failed to update context menu", err);
      }
    });

    var label = document.createElement('label');
    label.setAttribute('for', radioId);
    var optTitle = options['title' + i];
    var text = document.createTextNode(optTitle);
    label.appendChild(text);

    var span = document.createElement('span')
    span.setAttribute('class', 'radio');
    span.appendChild(btn);
    span.appendChild(label);

    group.appendChild(span);
  }

}

function populateText(options, formatId, url, title, selectedText) {
  var format = options['format' + formatId];
  var text = formatURL(format, url, title, selectedText);
  var textElem = document.getElementById('textToCopy');
  textElem.value = text;
  textElem.focus();
  textElem.select();
  document.execCommand('copy');
}

async function init() {
  var options = await gettingOptions();
  var res = await browser.storage.local.get("lastCopied");
  var lastCopied = res.lastCopied;
  if (lastCopied.url) {
    return populateFields(options, lastCopied.url, lastCopied.title, lastCopied.selectedText);
  }
  var tabs = await browser.tabs.query({active: true, currentWindow: true});
  if (tabs[0]) {
    var tab = tabs[0];
    var response = await browser.tabs.sendMessage(tab.id, {"method": "getSelection"});
    try {
      populateFields(options, tab.url, tab.title, response.selection);
    } catch (err) {
      populateFields(options, tab.url, tab.title);
    }
  }
}
document.addEventListener('DOMContentLoaded', init);
