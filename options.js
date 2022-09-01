async function restoreOptions() {
  const options = await gettingOptions();
  for (let i = 1; i <= 9; ++i) {
    document.getElementById('title'+i).value = options['title'+i] || '';
    document.getElementById('format'+i).value = options['format'+i] || '';
    document.getElementById('html'+i).checked = !!options['html'+i];
  }
  for (let name of VARIABLE_NAMES) {
    document.getElementById(name+'_format').value = options[name+'_format'] || '';
  }
  document.getElementById('enableContextMenusCheckbox').checked = options['enableContextMenus'];
  document.getElementById('createSubmenusCheckbox').checked = options['createSubmenus'];
}

async function saveOptions(defaultFormatID) {
  let options;
  try {
    options = defaultFormatID ?
      {'defaultFormat': defaultFormatID} : await gettingOptions();
    for (let i = 1; i <= 9; ++i) {
      options['title'+i] = document.getElementById('title'+i).value;
      options['format'+i] = document.getElementById('format'+i).value;
      options['html'+i] = document.getElementById('html'+i).checked ? 1 : 0;
    }
    for (let name of VARIABLE_NAMES) {
      options[name+'_format'] = document.getElementById(name+'_format').value;
    }
    options['enableContextMenus'] = document.getElementById('enableContextMenusCheckbox').checked;
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
  for (let i = 1; i <= 9; ++i) {
    document.getElementById('title'+i).value = DEFAULT_OPTIONS['title'+i] || '';
    document.getElementById('format'+i).value = DEFAULT_OPTIONS['format'+i] || '';
    document.getElementById('html'+i).checked = DEFAULT_OPTIONS['html'+i] || 0;
  }
  for (let name of VARIABLE_NAMES) {
    document.getElementById(name+'_format').value = DEFAULT_OPTIONS[name+'_format'] || '';
  }
  document.getElementById('enableContextMenusCheckbox').checked = DEFAULT_OPTIONS['enableContextMenus'];
  document.getElementById('createSubmenusCheckbox').checked = DEFAULT_OPTIONS['createSubmenus'];
  return saveOptions(DEFAULT_OPTIONS['defaultFormat']);
}

async function init() {
  await restoreOptions();
  document.getElementById('enableContextMenusCheckbox').
    addEventListener('click', function(e) {
      document.getElementById('createSubmenusCheckbox').disabled =
      !document.getElementById('enableContextMenusCheckbox').checked;
    });
  document.getElementById('saveButton').
    addEventListener('click', function(e) {
      e.preventDefault();
      saveOptions();
    });
  document.getElementById('restoreDefaultsButton').
    addEventListener('click', function(e) {
      e.preventDefault();
      restoreDefaults();
    });
}
document.addEventListener('DOMContentLoaded', init);
