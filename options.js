function getDefaultFormat() {
  var select = elem('defaultFormat');
  return select.children[select.selectedIndex].value;
}

function setDefaultFormat(value) {
  var select = elem('defaultFormat');
  var index = 0;
  for (var i = 0; i < select.children.length; ++i) {
    if (select.children[i].value == value) {
      index = i;
      break;
    }
  }
  select.selectedIndex = index;
}

function restoreOptions() {
  onGot = function(item) {
    if (!item.defaultFormat) {
      restoreDefaults();
      return;
    }
    setDefaultFormat(item.defaultValue);
    for (var i = 1; i <= 9; ++i) {
      elem('title'+i).value = item['title'+i] || '';
      elem('format'+i).value = item['format'+i] || '';
    }
  }
  onErr = function(err) {
    console.log('onErr', err);
  }
  browser.storage.sync.get(optionKeys()).then(onGot, onErr);
}

function saveOptions() {
  var values = {defaultFormat: getDefaultFormat()}
  for (var i = 1; i <= 9; ++i) {
    values['title'+i] = elem('title'+i).value;
    values['format'+i] = elem('format'+i).value;
  }
  browser.storage.sync.set(values);
}

function restoreDefaults() {
  for (var i = 1; i <= 9; ++i) {
    elem('title'+i).value = DEFAULT_OPTIONS['title'+i] || '';
    elem('format'+i).value = DEFAULT_OPTIONS['format'+i] || '';
  }
  setDefaultFormat(DEFAULT_OPTIONS['defaultFormat']);
  saveOptions();
}

function init() {
  restoreOptions();
  elem('saveButton').addEventListener('click', saveOptions);
  elem('restoreDefaultsButton').addEventListener('click', restoreDefaults);
}

document.addEventListener('DOMContentLoaded', init);
