function elem(id) {
  return document.getElementById(id);
}

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
  var value = localStorage['defaultFormat'];
  if (!value) {
    restoreDefaults();
  }
  for (var i = 1; i <= 9; ++i) {
    elem('title'+i).value = localStorage['title'+i] || '';
    elem('format'+i).value = localStorage['format'+i] || '';
  }
  setDefaultFormat(value);
}

function saveOptions() {
  localStorage['defaultFormat'] = getDefaultFormat();
  for (var i = 1; i <= 9; ++i) {
    localStorage['title'+i] = elem('title'+i).value;
    localStorage['format'+i] = elem('format'+i).value;
  }
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
