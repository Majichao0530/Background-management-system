// 头部导航组件

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { formatDate } from "../../utils/dateUtils";
import { reqWeather } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import menuList from "../../config/menuConfig";
import "./index.less";
import LinkButton from "../link-button";

class Header extends Component {
  state = {
    currentTime: formatDate(Date.now()), // 当前时间的字符串
    dayPictureUrl: "", // 天气图片
    weather: "" // 天气文本
  };

  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = formatDate(Date.now());
      this.setState({ currentTime });
    }, 1000);
  };

  getWeather = async () => {
    const { dayPictureUrl, weather } = await reqWeather("北京");
    this.setState({ dayPictureUrl, weather });
  };

  getTitle = () => {
    const path = this.props.location.pathname;
    let title;
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title;
      } else if (item.children) {
        const cItem = item.children.find(cItem => cItem.key === path);
        if (cItem) {
          title = cItem.title;
        }
      }
    });
    return title;
  };

  Logout = () => {
    // 显示确认框
    Modal.confirm({
      content: "是否确认退出？",
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        console.log("退出成功");
        // 删除保存的user数据
        storageUtils.removeUser();
        memoryUtils.user = {};
        // 跳转至login页面
        this.props.history.replace("/login");
      }
    });
  };

  // 第一次render()之后执行一次 一般在此执行异步操作：发ajax、启动定时器
  componentDidMount() {
    // 获取当前时间
    this.getTime();
    // 获取当前天气
    this.getWeather();
  }

  // 当前组件卸载之前执行
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
  render() {
    const { currentTime, dayPictureUrl, weather } = this.state;
    const username = memoryUtils.user.username;
    const title = this.getTitle();
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton href="#" onClick={this.Logout}>
            退出
          </LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

/* 
  高阶组件withRouter 包装非路由组件 返回新组件
  新的组件会向非路由组件传递：history、location、match
*/
export default withRouter(Header);
