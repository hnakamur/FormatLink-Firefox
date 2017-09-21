async function restoreOptions() {
  var options = await gettingOptions();
  for (var i = 1; i <= 9; ++i) {
    document.getElementById('title'+i).value = options['title'+i] || '';
    document.getElementById('format'+i).value = options['format'+i] || '';
  }
  document.getElementById('createSubmenusCheckbox').checked = options['createSubmenus'];
}

async function saveOptions(defaultFormatID) {
  var options;
  try {
    options = defaultFormatID ?
      {'defaultFormat': defaultFormatID} : await gettingOptions();
    for (var i = 1; i <= 9; ++i) {
      options['title'+i] = document.getElementById('title'+i).value;
      options['format'+i] = document.getElementById('format'+i).value;
    }
    options['createSubmenus'] = document.getElementById('createSubmenusCheckbox').checked;
  } catch (err) {
    console.error("failed to get options", err);
  }
  try {
    await browser.storage.sync.set(options);
  } catch (err) {
    console.error("failed to save options", err);
  }
  try {
    await createContextMenus(options);
  } catch (err) {
    console.error("failed to update context menu", err);
  }
}

async function restoreDefaults() {
  for (var i = 1; i <= 9; ++i) {
    document.getElementById('title'+i).value = DEFAULT_OPTIONS['title'+i] || '';
    document.getElementById('format'+i).value = DEFAULT_OPTIONS['format'+i] || '';
  }
  document.getElementById('createSubmenusCheckbox').checked = DEFAULT_OPTIONS['createSubmenus'];
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
