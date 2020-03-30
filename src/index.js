// 入口js文件

import React from "react";
import ReactDom from "react-dom";

import App from "./App.js";

// 将App组件标签渲染到index页面的div中
ReactDom.render(<App />, document.getElementById("root"));
