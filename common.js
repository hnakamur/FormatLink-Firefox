var DEFAULT_OPTIONS = {
  "defaultFormat": 1,
  "title1": "Markdown",
  "format1": "[{{title.s(\"\\\\[\",\"\\\\[\").s(\"\\\\]\",\"\\\\]\")}}]({{url.s(\"\\\\)\",\"%29\")}})",
  "title2": "Redmine Texitle",
  "format2": "\"{{title.s(\"\\\"\",\"&quot;\").s(\"\\\\[\",\"&#91;\")}}\":{{url}}",
  "title3": 'HTML',
  "format3": "<a href=\"{{url.s(\"\\\"\",\"&quot;\")}}\">{{title.s(\"<\",\"&lt;\")}}</a>",
  "title4": "Text",
  "format4": "{{title}}\\n{{url}}",
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

function elem(id) {
  return document.getElementById(id);
}

function optionKeys() {
  var keys = ['defaultFormat'];
  for (var i = 1; i <= 9; ++i) {
    keys.push('title'+i);
    keys.push('format'+i);
  }
  return keys;
}
