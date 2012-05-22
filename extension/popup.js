function populateFields(url, title) {
  populateFormatSelect(url, title);
  var formatId = getOption('defaultFormat');
  populateText(formatId, url, title);
}

function populateFormatSelect(url, title) {
  var selectElem = elem('formatSelect');
  for (var i = 1; i <= 9; ++i) {
    var optTitle = getOption('title' + i);
    var optFormat = getOption('format' + i);
    if (optTitle === '' || optFormat === '') {
      break;
    }
    selectElem.options[i - 1] = new Option(optTitle, i);
  }
  selectElem.selectedIndex = getOption('defaultFormat') - 1;
  selectElem.addEventListener('change', function() {
    var formatId = selectElem.options[selectElem.selectedIndex].value;
    populateText(formatId, url, title);
  });
}

function populateText(formatId, url, title) {
  var format = getOption('format' + formatId);
  var text = formatUrl(format, url, title);
  var textElem = document.getElementById('textToCopy');
  textElem.value = text;
  textElem.focus();
  textElem.select();
  document.execCommand('copy');
}

function saveDefaultFormat() {
  var selectElem = elem('formatSelect');
  var formatId = selectElem.options[selectElem.selectedIndex].value;
  localStorage['defaultFormat'] = formatId;
}

function init() {
  elem('saveDefaultFormatButton').addEventListener('click', saveDefaultFormat);
  chrome.windows.getCurrent(function(currentWindow) {
    chrome.tabs.getSelected(currentWindow.id, function(tab) {
      populateFields(tab.url, tab.title);
    });
  });
}

function formatUrl(format, url, title) {
  var text = '';
  var work;
  var i = 0, len = format.length;

  function parseLiteral(str) {
    if (format.substr(i, str.length) === str) {
      i += str.length;
      return str;
    } else {
      return null;
    }
  }

  function parseString() {
    var str = '';
    if (parseLiteral('"')) {
      while (i < len) {
        if (parseLiteral('\\')) {
          if (i < len) {
            str += format.substr(i++, 1);
          } else {
            throw new Error('parse error expected "');
          }
        } else if (parseLiteral('"')) {
          return str;
        } else {
          if (i < len) {
            str += format.substr(i++, 1);
          } else {
            throw new Error('parse error expected "');
          }
        }
      }
    } else {
      return null;
    }
  }

  function processVar(value) {
    var work = value;
    while (i < len) {
      if (parseLiteral('.s(')) {
        var arg1 = parseString();
        if (arg1 && parseLiteral(',')) {
          var arg2 = parseString();
          if (arg2 && parseLiteral(')')) {
            var regex = new RegExp(arg1, 'g');
            work = work.replace(regex, arg2);
          } else {
            throw new Error('parse error');
          }
        } else {
          throw new Error('parse error');
        }
      } else if (parseLiteral('}}')) {
        text += work;
        return;
      } else {
        throw new Error('parse error');
      }
    }
  }

  while (i < len) {
    if (parseLiteral('\\')) {
      if (parseLiteral('n')) {
        text += "\n";
      } else if (parseLiteral('t')) {
        text += "\t";
      } else {
        text += format.substr(i++, 1);
      }
    } else if (parseLiteral('{{')) {
      if (parseLiteral('title')) {
        processVar(title);
      } else if (parseLiteral('url')) {
        processVar(url);
      }
    } else {
      text += format.substr(i++, 1);
    }
  }
  return text;
}

document.addEventListener('DOMContentLoaded', init);
