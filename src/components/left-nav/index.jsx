// 左侧导航组件
import React, { Component } from "react";

import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined
} from "@ant-design/icons";

import "./index.less";

const { SubMenu } = Menu;

export default class LeftNav extends Component {
  render() {
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="" />
          <h1>项目后台</h1>
        </Link>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
        >
          <Menu.Item key="1">
            <Link to="/home">
              <PieChartOutlined />
              <span>首页</span>
            </Link>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <MailOutlined />
                <span>商品</span>
              </span>
            }
          >
            <Menu.Item key="2">
              <Link to="/category">
                <DesktopOutlined />
                <span>品类管理</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/product">
                <DesktopOutlined />
                <span>商品管理</span>
              </Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="4">
            <Link to="/user">
              <DesktopOutlined />
              <span>用户管理</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/role">
              <ContainerOutlined />
              <span>角色管理</span>
            </Link>
          </Menu.Item>
          <SubMenu
            key="sub2"
            title={
              <span>
                <AppstoreOutlined />
                <span>Navigation Two</span>
              </span>
            }
          >
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}
