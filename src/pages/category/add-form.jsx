// 添加分类的表单组件
import React, { Component } from "react";
import { Form, Input, Select } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;
const Option = Select.Option;
export default class AddForm extends Component {
  formRef = React.createRef();
  static propTypes = {
    categorys: PropTypes.array.isRequired, // 一级分类数组
    parentId: PropTypes.string.isRequired, // 现在表格显示的父分类的id
    setForm: PropTypes.func.isRequired,
  };
  componentWillMount() {
    this.props.setForm(this.formRef);
  }
  render() {
    const { categorys, parentId } = this.props;
    return (
      <Form ref={this.formRef} initialValues={{ parentId: parentId }}>
        <Item name="parentId">
          <Select>
            <Option value="0">一级分类</Option>
            {categorys.map((c) => (
              <Option value={c._id} key={c._id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </Item>
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
