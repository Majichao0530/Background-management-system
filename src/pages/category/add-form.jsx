// 添加分类的表单组件
import React, { Component } from "react";
import { Form, Input, Select } from "antd";

const Item = Form.Item;
const Option = Select.Option;
export default class AddForm extends Component {
  render() {
    return (
      <Form initialValues={{ parentId: "0" }}>
        <Item name="parentId">
          <Select>
            <Option value="0">一级</Option>
            <Option value="1">AJ1</Option>
            <Option value="2">AJ2</Option>
          </Select>
        </Item>
        <Item name="categoryName">
          <Input placeholder="请输入分类名称"></Input>
        </Item>
      </Form>
    );
  }
}
