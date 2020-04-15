// 添加/修改用户的form组件

import React, { Component } from "react";
import { Form, Input, Select } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;
const Option = Select.Option;

export default class UserForm extends Component {
  formRef = React.createRef();
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    user: PropTypes.object,
  };
  componentWillMount() {
    this.props.setForm(this.formRef);
  }
  render() {
    const { roles } = this.props;
    const user = this.props.user || {};
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
    };
    return (
      <Form
        ref={this.formRef}
        {...formItemLayout}
        initialValues={{
          username: user.username,
          password: user.password,
          phone: user.phone,
          email: user.email,
          role_id: user.role_id,
        }}
      >
        <Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: "角色名称不能为空" }]}
        >
          <Input placeholder="请输入用户名"></Input>
        </Item>
        {user._id ? null : (
          <Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "密码不能为空" }]}
          >
            <Input type="password" placeholder="请输入密码"></Input>
          </Item>
        )}

        <Item name="phone" label="手机号">
          <Input placeholder="请输入手机号"></Input>
        </Item>
        <Item name="email" label="邮箱">
          <Input placeholder="请输入邮箱"></Input>
        </Item>
        <Item name="role_id" label="角色">
          <Select placeholder="请选择角色">
            {roles.map((role) => (
              <Option key={role._id} value={role._id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    );
  }
}
