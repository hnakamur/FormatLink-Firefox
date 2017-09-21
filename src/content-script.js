import m from "mithril";
import stream from "mithril-stream";
import { Menu, List, ListTile, RaisedButton } from "polythene-mithril";

console.log("hello content-script");

// const opener = ({ id, menuOptions }) => ({
//     oninit: vnode => {
//      const show = stream(false);
//      vnode.state = {
//         show
//       };
//    },
//     view: vnode => {
//      const state = vnode.state;
//      const show = state.show();
//      return m("div",
//         { style: { position: "relative" } },
//         [
//         m(RaisedButton, {
//                    label: "Open menu",
//                    id,
//                    events: {
//                     onclick: () => state.show(true)
//                        }
//                  }
//              ),
//         m(Menu, Object.assign(
//                {},
//                {
//                  target: `#${id}`,
//                  show,
//                  didHide: () => state.show(false)
//                },
//              menuOptions
//            ))
//          ]
//       );
//    }
// });

// const simpleList = 
//   m(List, [
//     m(ListTile, {
//           title: "Yes",
//           ink: true,
//           hoverable: true,
//         }),
//     m(ListTile, {
//           title: "No",
//           ink: true,
//           hoverable: true,
//         })
// ]);
// 
// console.log("simpleList=", simpleList);

// const TransitionsMenu = opener({
//     id: "transitions",
//     menuOptions: {
//           size: 2, 
//           content: simpleList,
//           hideDelay: .3,
//           transitions: {
//                   show: el => ({
//                             el,
//                             beforeShow:   () => (
//                                         el.style.opacity = 0,
//                                         el.style.transform = "translate3d(0, 20px, 0)"
//                                       ),
//                             show:         () => (
//                                         el.style.opacity = 1,
//                                         el.style.transform = "translate3d(0, 0px,  0)"
//                                       )
//                           }),
//                   hide: el => ({
//                             el,
//                             hide:         () => (
//                                         el.style.opacity = 0,
//                                         el.style.transform = "translate3d(0, 20px, 0)"
//                                       )
//                           })
//                 }
//         }
// });

const mountPointID = "format-link-extension-content";
var div = document.getElementById(mountPointID);
if (!div) {
  div = document.createElement("div");
  div.setAttribute("id", mountPointID);
  document.body.appendChild(div);
}

//m.render(div, "Hello world");
//m.render(div, m("h1", "Hello world"));
// m.render(div,
//   m("div", [
// 
//          m(RaisedButton, {
//                     label: "Open menu",
//         }),
//   m(Menu, {
//     size: 2,
//     content: m(List, [
//       m(ListTile, {
//         title: "Yes",
//         ink: true,
//         hoverable: true,
//       }),
//       m(ListTile, {
//         title: "No",
//         ink: true,
//         hoverable: true,
//       })
//     ])
//   })
//   ])
// );

m.render(div, [
  m("h1", "Hello world"),
  m(RaisedButton, {
    label: "Open menu",
  }),
  m(Menu, {
    size: 2,
    permanent: true,
    content: [
      m(List, [
        m(ListTile, {
          title: "Yes",
          ink: true,
          hoverable: true,
        }),
        m(ListTile, {
          title: "No",
          ink: true,
          hoverable: true,
        })
      ])
    ]
  })
]);
