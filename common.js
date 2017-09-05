var FORMAT_MAX_COUNT = 9;

var DEFAULT_OPTIONS = {
  "defaultFormat": 1,
  "title1": "Markdown",
  "format1": "[{{text.s(\"\\\\[\",\"\\\\[\").s(\"\\\\]\",\"\\\\]\")}}]({{url.s(\"\\\\)\",\"%29\")}})",
  "title2": "reST",
  "format2": "`{{text}} <{{url}}>`_",
  "title3": "Text",
  "format3": "{{text}}\\n{{url}}",
  "title4": 'HTML',
  "format4": "<a href=\"{{url.s(\"\\\"\",\"&quot;\")}}\">{{text.s(\"<\",\"&lt;\")}}</a>",
  "title5": "",
  "format5": "",
  "title6": "",
  "format6": "",
  "title7": "",
  "format7": "",
  "title8": "",
  "format8": "",
  "title9": "",
  "format9": ""
};

function saveDefaultFormat(format) {
  browser.storage.sync.set({defaultFormat: format});
}

function gettingOptions() {
  var keys = ['defaultFormat'];
  for (var i = 1; i <= 9; ++i) {
    keys.push('title'+i);
    keys.push('format'+i);
  }

  function onGot(item) {
    var options = item;
    if (!options.defaultFormat) {
      options = DEFAULT_OPTIONS;
    }
    return Promise.resolve(options);
  }
  function onErr(err) {
    console.error('failed to load options', err);
  }
  return browser.storage.sync.get(keys).then(onGot, onErr);
}

function getFormatCount(options) {
  var i;
  for (i = 1; i <= 9; ++i) {
    var optTitle = options['title' + i];
    var optFormat = options['format' + i];
    if (optTitle === '' || optFormat === '') {
      break;
    }
  }
  return i - 1;
}

function createContextMenu(options) {
  browser.contextMenus.removeAll();
  browser.contextMenus.create({
    id: "format-link-format-default",
    title: "Format Link as Default",
    contexts: ["all"]
  });
}

function formatURL(format, url, title, selectedText) {
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
      } else if (parseLiteral('text')) {
        processVar(selectedText ? selectedText : title);
      }
    } else {
      text += format.substr(i++, 1);
    }
  }
  return text;
}
