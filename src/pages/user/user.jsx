// 用户管理路由
import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { formatDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button";
import { PAGE_SIZE } from "../../utils/constants";
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from "../../api";
import UserForm from "./user-form";
import "./user.less";

export default class User extends Component {
  state = {
    users: [],
    roles: [],
    showFlag: false,
  };

  initColumns = () => {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username",
      },
      {
        title: "邮箱",
        dataIndex: "email",
      },
      {
        title: "电话",
        dataIndex: "phone",
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        render: formatDate,
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        render: (role_id) =>
          // this.state.roles.find((role) => role._id === role_id).name,
          this.roleNames[role_id],
      },
      {
        title: "操作",
        render: (user) => (
          <span>
            <LinkButton
              onClick={() => {
                this.showUpdate(user);
              }}
            >
              修改
            </LinkButton>
            <LinkButton
              onClick={() => {
                this.deleteUser(user);
              }}
            >
              删除
            </LinkButton>
          </span>
        ),
      },
    ];
  };

  //根据role数组 生成角色id值对应角色名的对象数据结构
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {});
    this.roleNames = roleNames;
  };

  addOrUpdateUser = async () => {
    this.setState({ showFlag: false });
    const user = this.formRef.current.getFieldsValue();
    // this.formRef.current.resetFields();
    if (this.user) {
      user._id = this.user._id;
    }
    const result = await reqAddOrUpdateUser(user);
    if (result.status === 0) {
      message.success(`${this.user ? "修改" : "创建"}用户成功`);
      this.getUsers();
    } else {
      message.error(`${this.user ? "修改" : "创建"}用户失败`);
    }
  };

  showAdd = () => {
    this.user = null;
    this.setState({ showFlag: true });
  };

  showUpdate = (user) => {
    this.user = user;
    this.setState({ showFlag: true });
  };

  deleteUser = (user) => {
    Modal.confirm({
      title: `是否确认删除用户${user.username}`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if (result.status === 0) {
          message.success("用户删除成功");
          this.getUsers();
        } else {
          message.error("用户删除失败");
        }
      },
    });
  };

  getUsers = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      const { users, roles } = result.data;
      this.initRoleNames(roles);
      this.setState({ users, roles });
    } else {
      message.error("获取用户列表失败");
    }
  };

  componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getUsers();
  }

  render() {
    const title = (
      <Button type="primary" onClick={this.showAdd}>
        创建用户
      </Button>
    );
    const { users, showFlag, roles } = this.state;
    const user = this.user;
    return (
      <Card title={title}>
        <Table
          dataSource={users}
          columns={this.columns}
          bordered
          rowKey="_id"
          pagination={{ defaultPageSize: PAGE_SIZE }}
        />
        <Modal
          title={user ? "修改用户" : "创建用户"}
          visible={showFlag}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.setState({ showFlag: false });
          }}
          destroyOnClose
        >
          <UserForm
            setForm={(formRef) => (this.formRef = formRef)}
            roles={roles}
            user={user}
          />
        </Modal>
      </Card>
    );
  }
}
