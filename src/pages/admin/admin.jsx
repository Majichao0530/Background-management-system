// 管理的路由组件

import React, { Component } from "react";

import memoryUtils from "../../utils/memoryUtils";
import { Redirect } from "react-router-dom";

export default class Admin extends Component {
  render() {
    const user = memoryUtils.user;
    // 内存中没有user => 没有登录
    if (!user || !user._id) {
      // 自动跳转到登录界面
      return <Redirect to="/login" />;
    }
    return <div>Hello {user.username}</div>;
  }
}
