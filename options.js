function getDefaultFormat() {
  var select = document.getElementById('defaultFormat');
  return select.children[select.selectedIndex].value;
}

function setDefaultFormat(value) {
  var select = document.getElementById('defaultFormat');
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
  gettingOptions().then(options => {
    setDefaultFormat(options.defaultValue);
    for (var i = 1; i <= 9; ++i) {
      document.getElementById('title'+i).value = options['title'+i] || '';
      document.getElementById('format'+i).value = options['format'+i] || '';
    }
  });
}

function saveOptions() {
  var values = {defaultFormat: getDefaultFormat()}
  for (var i = 1; i <= 9; ++i) {
    values['title'+i] = document.getElementById('title'+i).value;
    values['format'+i] = document.getElementById('format'+i).value;
  }
  browser.storage.sync.set(values);
  options = values;
  createContextMenus();
}

function restoreDefaults() {
  for (var i = 1; i <= 9; ++i) {
    document.getElementById('title'+i).value = DEFAULT_OPTIONS['title'+i] || '';
    document.getElementById('format'+i).value = DEFAULT_OPTIONS['format'+i] || '';
  }
  setDefaultFormat(DEFAULT_OPTIONS['defaultFormat']);
  saveOptions();
}

function init() {
  restoreOptions();
  document.getElementById('saveButton').addEventListener('click', saveOptions);
  document.getElementById('restoreDefaultsButton').addEventListener('click', restoreDefaults);
}

document.addEventListener('DOMContentLoaded', init);
