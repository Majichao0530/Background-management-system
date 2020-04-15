import React, { Component } from "react";
import { Form, Input } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;
export default class AddForm extends Component {
  formRef = React.createRef();
  static propTypes = {
    setForm: PropTypes.func.isRequired,
  };
  componentWillMount() {
    this.props.setForm(this.formRef);
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
    };
    return (
      <Form ref={this.formRef}>
        <Item
          name="roleName"
          label="角色名称"
          {...formItemLayout}
          rules={[{ required: true, message: "角色名称不能为空" }]}
        >
          <Input placeholder="请输入角色名称"></Input>
        </Item>
      </Form>
    );
  }
}
