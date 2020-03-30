// 登录的路由组件

import React, { Component } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import "./login.less";

import logo from "./images/logo.png";

export default class Login extends Component {
  // 自定义验证
  //   validatePwd = (rule, value, callback) => {
  //     if (!value) {
  //       callback("请输入密码");
  //     } else if (value.length < 4) {
  //       callback("密码最小长度为4位");
  //     } else if (value.length > 12) {
  //       callback("密码最大长度为12位");
  //     } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
  //       callback("用户名禁止出现特殊字符");
  //     } else {
  //       callback();
  //     }
  //   };
  render() {
    const onFinish = values => {
      console.log("提交登录的ajax请求", values);
    };
    const onFinishFailed = errorInfo => {
      console.log("校验失败!");
    };
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="username"
              rules={[
                // 声明验证
                { required: true, whitespace: false, message: "请输入用户名" },
                { min: 4, message: "用户名最小长度为4位" },
                { max: 12, message: "用户名最大长度为12位" },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "用户名禁止出现特殊字符"
                }
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item
              name="password"
              // 自定义验证
              //   rules={[{ validator: this.validatePwd }]}
              rules={[
                { required: true, message: "请输入密码" },
                { min: 4, message: "密码最小长度为4位" },
                { max: 12, message: "密码最大长度为12位" },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "密码禁止出现特殊字符"
                }
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
