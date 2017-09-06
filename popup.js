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
    btn.addEventListener('click', e => {
      gettingOptions().then(options => {
        var formatId = e.target.value;
        populateText(options, formatId, url, title, selectedText);
        var defaultName = options['title' + formatId];
        saveDefaultFormat(formatId).
        then(() => {
          updateContextMenu(defaultName).
          catch(err => {
            console.error("failed to update context menu", err);
          });
        });
      });
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

function init() {
  browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
    if (tabs[0]) {
      var tab = tabs[0];
      gettingOptions().then(options => {
        browser.tabs.sendMessage(tab.id, {"method": "getSelection"}).
        then(response => {
          populateFields(options, tab.url, tab.title, response.selection);
        }).catch(reason => {
          populateFields(options, tab.url, tab.title);
        });
      });
    }
  });
}
document.addEventListener('DOMContentLoaded', init);
