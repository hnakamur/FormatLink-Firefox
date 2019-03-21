function populateText(formattedText) {
  const textElem = document.getElementById('textToCopy');
  textElem.value = formattedText;
  textElem.focus();
  textElem.select();
}

function populateFormatGroup(options) {
  const defaultFormat = options['defaultFormat'];
  let radios = [];
  const cnt = getFormatCount(options);
  let group = document.getElementById('formatGroup');
  while (group.hasChildNodes()) {
    group.removeChild(group.childNodes[0]);
  }
  for (let i = 1; i <= cnt; ++i) {
    let radioId = 'format' + i;

    let btn = document.createElement('input');
    btn.setAttribute('type', 'radio');
    btn.setAttribute('name', 'fomrat');
    btn.setAttribute('id', radioId);
    btn.setAttribute('value', i);
    if (i == defaultFormat) {
      btn.setAttribute('checked', 'checked');
    }
    btn.addEventListener('click', async e => {
      const formatID = e.target.value;
      const format = options['format' + formatID];
      const formattedText = await copyLinkToClipboard(format);
      populateText(formattedText);
    });

    let label = document.createElement('label');
    label.setAttribute('for', radioId);
    let optTitle = options['title' + i];
    let text = document.createTextNode(optTitle);
    label.appendChild(text);

    let span = document.createElement('span')
    span.setAttribute('class', 'radio');
    span.appendChild(btn);
    span.appendChild(label);

    group.appendChild(span);
  }
}

function getSelectedFormatID() {
  for (let i = 1; i <= FORMAT_MAX_COUNT; ++i) {
    let radio = document.getElementById('format' + i);
    if (radio && radio.checked) {
      return i;
    }
  }
  return undefined;
}

async function init() {
  document.getElementById('saveDefaultFormatButton').addEventListener('click', async () => {
    let format = getSelectedFormatID();
    if (format) {
      await saveDefaultFormat(format);
    }
  });

  const options = await gettingOptions();
  const format = options['format' + options.defaultFormat];
  let formattedText = await copyLinkToClipboard(format);
  populateText(formattedText);
  populateFormatGroup(options);
}
document.addEventListener('DOMContentLoaded', init);
