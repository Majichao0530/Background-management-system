// 左侧导航组件
import React, { Component } from "react";

import logo from "../../assets/images/logo.png";
import { Link, withRouter } from "react-router-dom";
import { Menu } from "antd";
import menuList from "../../config/menuConfig";
import * as Icon from "@ant-design/icons";
import "./index.less";

const { SubMenu } = Menu;

class LeftNav extends Component {
  // 根据menuList数据数组生成对应的标签数组
  // 使用map+递归调用 666
  getMenuNodes_map = menuList => {
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              {React.createElement(Icon[item.icon])}
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        );
      } else {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                {React.createElement(Icon[item.icon])}
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes_map(item.children)}
          </SubMenu>
        );
      }
    });
  };
  // 使用reduce+递归
  getMenuNodes = menuList => {
    const path = this.props.location.pathname;
    return menuList.reduce((pre, item) => {
      // 向pre添加两种元素，判断
      if (!item.children) {
        pre.push(
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              {React.createElement(Icon[item.icon])}
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        );
      } else {
        // 查找一个与当前请求路径匹配的item
        const cItem = item.children.find(cItem => cItem.key === path);
        // 如果存在则意味着当前item需要展开
        if (cItem) {
          this.openKey = item.key;
        }
        pre.push(
          <SubMenu
            key={item.key}
            title={
              <span>
                {React.createElement(Icon[item.icon])}
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        );
      }
      return pre;
    }, []);
  };

  componentWillMount() {
    this.meunNodes = this.getMenuNodes(menuList);
  }
  render() {
    const path = this.props.location.pathname;
    const openKey = this.openKey;
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="" />
          <h1>项目后台</h1>
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {this.meunNodes}
        </Menu>
      </div>
    );
  }
}

/* 
  高阶组件withRouter 包装非路由组件 返回新组件
  新的组件会向非路由组件传递：history、location、match
*/
export default withRouter(LeftNav);
