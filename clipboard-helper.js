// This function must be called in a visible page, such as a browserAction popup
// or a content script. Calling it in a background page has no effect!
function FormatLink_copyHTMLToClipboard(text) {
  function oncopy(event) {
    document.removeEventListener("copy", oncopy, true);
    // Hide the event from the page to prevent tampering.
    event.stopImmediatePropagation();

    // Overwrite the clipboard content.
    event.preventDefault();
    event.clipboardData.setData("text/plain", text);
    event.clipboardData.setData("text/html", text);
  }
  document.addEventListener("copy", oncopy, true);

  // Requires the clipboardWrite permission, or a user gesture:
  document.execCommand("copy");
}

function FormatLink_formatLink(format, options, newline, linkUrl, linkText) {
  function getFirstLinkInSelection(selection) {
    return selection.anchorNode.parentNode.href;
  }

  function formatURL(format, url, title, text, selectedText, newline, isVar) {
    let result = '';
    let i = 0, len = format.length;

    function parseLiteral(str) {
      if (format.substr(i, str.length) === str) {
        i += str.length;
        return str;
      } else {
        return null;
      }
    }

    function parseString() {
      let str = '';
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

    function processVar(name, value) {
      let work = value;
      if (!isVar) {
        const varFormat = options[name + '_format'];
        if (varFormat) {
          work = formatURL(varFormat, url, title, text, selectedText, newline, true);
        }
      }
      while (i < len) {
        if (parseLiteral('.s(')) {
          let arg1 = parseString();
          if (arg1 != null && parseLiteral(',')) {
            let arg2 = parseString();
            if (arg2 != null && parseLiteral(')')) {
              let regex = new RegExp(arg1, 'g');
              work = work.replace(regex, arg2);
            } else {
              throw new Error('parse error');
            }
          } else {
            throw new Error('parse error');
          }
        } else if (parseLiteral('}}')) {
          result += work;
          return;
        } else {
          throw new Error('parse error');
        }
      }
    }

    while (i < len) {
      if (parseLiteral('\\')) {
        if (parseLiteral('n')) {
          result += newline;
        //  isWindows ? "\r\n" : "\n";
        } else if (parseLiteral('t')) {
          result += "\t";
        } else {
          result += format.substr(i++, 1);
        }
      } else if (parseLiteral('{{')) {
        if (parseLiteral('title')) {
          processVar('title', title);
        } else if (parseLiteral('url')) {
          processVar('url', url);
        } else if (parseLiteral('page_url')) {
          processVar('page_url', window.location.href);
        } else if (parseLiteral('selected_text')) {
          processVar('selected_text', selectedText);
        } else if (parseLiteral('text')) {
          processVar('text', text);
        }
      } else {
        result += format.substr(i++, 1);
      }
    }
    return result;
  }

  let title = document.title;
  let text = linkText;
  let href = linkUrl;
  let selectedText = '';
  let selection = window.getSelection();
  if (selection.rangeCount > 0) {
    selectedText = selection.toString().trim();
    console.log('set selectedText from window.getSelection', selectedText);

    if (selectedText) {
      let hrefInSelection = getFirstLinkInSelection(selection);
      if (!href && hrefInSelection) {
        href = hrefInSelection;
      }
    }
  }
  if (!selectedText) {
    const elem = document.activeElement;
    if (elem && elem.selectionStart !== elem.selectionEnd) {
      selectedText = elem.value.substring(elem.selectionStart, elem.selectionEnd);
      console.log('set selectedText from activeElement', selectedText);
    }
  }
  if (selectedText) {
    text = selectedText;
  }
  if (!text) {
    text = title;
  }
  if (!href) {
    href = window.location.href;
  }

  return formatURL(format, href, title, text, selectedText, newline);
}
