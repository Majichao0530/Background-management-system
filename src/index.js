// 入口js文件

import React from "react";
import ReactDom from "react-dom";

import App from "./App.js";

import memoryUtils from "./utils/memoryUtils";
import storageUtils from "./utils/storageUtils";
// 读取local中的user并保存到内存中
const user = storageUtils.getUser();
memoryUtils.user = user;

// 将App组件标签渲染到index页面的div中
ReactDom.render(<App />, document.getElementById("root"));
