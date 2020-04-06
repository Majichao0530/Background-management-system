// 添加分类的表单组件
import React, { Component } from "react";
import { Form, Input } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;
export default class UpdateForm extends Component {
  formRef = React.createRef();
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired,
  };

  componentWillMount() {
    // 向父组件传递form对象
    this.props.setForm(this.formRef);
  }

  render() {
    const { categoryName } = this.props;
    console.log(this.formRef);
    return (
      <Form ref={this.formRef} initialValues={{ categoryName: categoryName }}>
        <Item
          name="categoryName"
          rules={[{ required: true, message: "品类名称不能为空" }]}
        >
          <Input placeholder="请输入分类名称"></Input>
        </Item>
      </Form>
    );
  }
}
