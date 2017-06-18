function populateFields(url, title, selectedText) {
  populateFormatGroup(url, title, selectedText);
  var formatId = options['defaultFormat'];
  populateText(formatId, url, title, selectedText);
}

function populateFormatGroup(url, title, selectedText) {
  var defaultFormat = options['defaultFormat'];
  var radios = [];
  var cnt = getFormatCount();
  var group = document.getElementById('formatGroup');
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
    btn.addEventListener('click', function(e) {
      var formatId = e.target.value;
      populateText(formatId, url, title, selectedText);
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

function populateText(formatId, url, title, selectedText) {
  var format = options['format' + formatId];
  var text = formatURL(format, url, title, selectedText);
  var textElem = document.getElementById('textToCopy');
  textElem.value = text;
  textElem.focus();
  textElem.select();
  document.execCommand('copy');
}

function getSelectedFormat() {
  var cnt = getFormatCount();
  for (var i = 1; i <= cnt; ++i) {
    if (document.getElementById('format' + i).checked) {
      return i;
    }
  }
  return undefined;
}

function saveDefaultFormat() {
  browser.storage.sync.set({defaultFormat: getSelectedFormat()});
}

function init() {
  document.getElementById('saveDefaultFormatButton').addEventListener('click', saveDefaultFormat);

  function updateTab(tabs) {
    if (tabs[0]) {
      var tab = tabs[0];
      browser.tabs.sendMessage(tab.id, {"method": "getSelection"}).
      then(response => {
        populateFields(tab.url, tab.title, response.selection);
      });
    }
  }
  gettingOptions().then(() => {
    browser.tabs.query({active: true, currentWindow: true}).then(updateTab)
  });
}

document.addEventListener('DOMContentLoaded', init);
