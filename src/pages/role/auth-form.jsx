import React, { Component } from "react";
import { Form, Input, Tree } from "antd";
import PropTypes from "prop-types";

import menuList from "../../config/menuConfigForAuth";

const Item = Form.Item;
// const { TreeNode } = Tree;
const treeData = menuList;

export default class AuthForm extends Component {
  static propTypes = {
    role: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const { menus } = this.props.role;
    this.state = {
      checkedKeys: menus,
    };
  }

  // 为父组件提供最新的权限信息
  getMenus = () => this.state.checkedKeys;

  onCheck = (checkedKeys) => {
    console.log("onCheck", checkedKeys);
    this.setState({ checkedKeys });
  };

  // 根据新选择的角色更新checkKeys状态
  // 当组件接收到新的属性时自动调用
  componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menus;
    this.setState({
      checkedKeys: menus,
    });
  }

  render() {
    const { role } = this.props;
    const { checkedKeys } = this.state;
    console.log(role);
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
    };
    return (
      <Form>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled></Input>
        </Item>
        <Tree
          checkable
          treeData={treeData}
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        />
      </Form>
    );
  }
}
