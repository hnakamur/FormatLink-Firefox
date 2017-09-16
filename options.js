async function restoreOptions() {
  var options = await gettingOptions();
  for (var i = 1; i <= 9; ++i) {
    document.getElementById('title'+i).value = options['title'+i] || '';
    document.getElementById('format'+i).value = options['format'+i] || '';
  }
}

async function saveOptions(defaultFormatID) {
  var options = {};
  if (defaultFormatID) {
    options.defaultFormat = defaultFormatID;
  }
  for (var i = 1; i <= 9; ++i) {
    options['title'+i] = document.getElementById('title'+i).value;
    options['format'+i] = document.getElementById('format'+i).value;
  }
  try {
    await browser.storage.sync.set(options);
    try {
      var defaultFormat = options['title' + (options['defaultFormat'] || '1')];
      await updateContextMenu(defaultFormat);
    } catch (err) {
      console.error("failed to update context menu", err);
    }
  } catch (err) {
    console.error("failed to save options", err);
  }
}

async function restoreDefaults() {
  for (var i = 1; i <= 9; ++i) {
    document.getElementById('title'+i).value = DEFAULT_OPTIONS['title'+i] || '';
    document.getElementById('format'+i).value = DEFAULT_OPTIONS['format'+i] || '';
  }
  return saveOptions(DEFAULT_OPTIONS['defaultFormat']);
}

async function init() {
  await restoreOptions();
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
}
document.addEventListener('DOMContentLoaded', init);
