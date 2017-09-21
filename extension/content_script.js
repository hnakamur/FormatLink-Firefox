import { m } from '../lib/mithril.js'

console.log("hello content_script.js, m=", m, ", m.stream=", m.stream);

var root = document.body

var div = document.createElement('div')
div.setAttribute("id", "format-link-extension-mount-point");
document.body.appendChild(div);
m.render(div, "Hello world")
