//function getDefaultFormat() {
//  var select = document.getElementById('defaultFormat');
//  return select.children[select.selectedIndex].value;
//}
//
//function setDefaultFormat(value) {
//  var select = document.getElementById('defaultFormat');
//  var index = 0;
//  for (var i = 0; i < select.children.length; ++i) {
//    if (select.children[i].value == value) {
//      index = i;
//      break;
//    }
//  }
//  select.selectedIndex = index;
//}

function restoreOptions() {
  return gettingOptions().then(options => {
    //setDefaultFormat(options.defaultFormat);
    for (var i = 1; i <= 9; ++i) {
      document.getElementById('title'+i).value = options['title'+i] || '';
      document.getElementById('format'+i).value = options['format'+i] || '';
    }
  });
}

function saveOptions() {
  return gettingOptions().then(options => {
    for (var i = 1; i <= 9; ++i) {
      options['title'+i] = document.getElementById('title'+i).value;
      options['format'+i] = document.getElementById('format'+i).value;
    }
    return browser.storage.sync.set(options).
    then(() => {
      var defaultFormat = options['title' + (options['defaultFormat'] || '1')];
      return updateContextMenu(defaultFormat).
      catch(err => {
        console.error("failed to save options", err);
      });
    }).
    catch(err => {
      console.error("failed to update context menu", err);
    });
  });
}

function restoreDefaults() {
  for (var i = 1; i <= 9; ++i) {
    document.getElementById('title'+i).value = DEFAULT_OPTIONS['title'+i] || '';
    document.getElementById('format'+i).value = DEFAULT_OPTIONS['format'+i] || '';
  }
  return saveDefaultFormat(DEFAULT_OPTIONS['defaultFormat']).
  then(() => {
    return saveOptions();
  });
}

function init() {
  restoreOptions().
  then(() => {
    document.getElementById('saveButton').
      addEventListener('click', function(e) {
        e.preventDefault();
        saveOptions();
      });
    document.getElementById('restoreDefaultsButton').
      addEventListener('click', function(e) {
        e.preventDefault();
        restoreDefaults()
      });
  });
}
document.addEventListener('DOMContentLoaded', init);
