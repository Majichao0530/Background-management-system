// 角色管理路由
import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";

import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";
import { PAGE_SIZE } from "../../utils/constants";
import AddForm from "./add-form";
import AuthForm from "./auth-form";
import "./role.less";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { formatDate } from "../../utils/dateUtils";

export default class Role extends Component {
  state = {
    roles: [],
    role: {}, // 选中的角色
    showAddFlag: false, // 是否显示添加界面
    showAuthFlag: false, // 是否显示权限界面
  };

  constructor(props) {
    super(props);
    this.auth = React.createRef();
  }

  initColumn = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: (create_time) => formatDate(create_time),
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: formatDate,
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
      },
    ];
  };

  getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      const roles = result.data;
      this.setState({
        roles,
      });
    } else {
      message.error("获取角色列表失败");
    }
  };

  onRow = (role) => {
    return {
      onClick: (event) => {
        this.setState({
          role,
        });
      },
    };
  };

  addRole = () => {
    // 表单验证
    this.formRef.current.validateFields().then(async (values) => {
      this.setState({ showAddFlag: false });
      const { roleName } = values;
      const result = await reqAddRole(roleName);
      if (result.status === 0) {
        message.success("添加角色成功");
        // this.getRoles();
        const role = result.data;
        // 更新roles列表的状态是基于原本状态数据更新
        this.setState((state) => ({
          roles: [...state.roles, role],
        }));
      } else {
        message.error("添加角色失败");
      }
    });
  };

  updateRole = async () => {
    const role = this.state.role;
    // 得到最新的权限
    const menus = this.auth.current.getMenus();
    role.menus = menus;
    role.auth_name = memoryUtils.user.username;
    role.auth_time = Date.now();
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      this.setState({ showAuthFlag: false });
      // this.getRoles();
      // 如果当前更新自己角色的权限，强制退出
      if (role._id === memoryUtils.user.role._id) {
        memoryUtils.user = {};
        storageUtils.removeUser();
        this.props.history.replace("/login");
        message.success("当前角色权限修改成功，请重新登录");
      } else {
        message.success("设置角色权限成功");
        this.setState({
          roles: [...this.state.roles],
        });
      }
    } else {
      message.error("设置角色权限失败");
    }
  };

  componentWillMount() {
    this.initColumn();
  }

  componentDidMount() {
    this.getRoles();
  }
  render() {
    const { roles, role, showAddFlag, showAuthFlag } = this.state;
    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => {
            this.setState({ showAddFlag: true });
          }}
        >
          创建角色
        </Button>{" "}
        &nbsp;&nbsp;
        <Button
          type="primary"
          disabled={!role._id}
          onClick={() => {
            this.setState({ showAuthFlag: true });
          }}
        >
          设置角色权限
        </Button>
      </span>
    );
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={roles}
          columns={this.columns}
          pagination={{
            defaultPageSize: PAGE_SIZE,
          }}
          rowSelection={{
            type: "radio",
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              this.setState({
                role,
              });
            },
          }}
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={showAddFlag}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ showAddFlag: false });
          }}
          destroyOnClose
        >
          <AddForm
            setForm={(formRef) => {
              this.formRef = formRef;
            }}
          />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={showAuthFlag}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ showAuthFlag: false });
          }}
          // destroyOnClose
        >
          <AuthForm role={role} ref={this.auth} />
        </Modal>
      </Card>
    );
  }
}
