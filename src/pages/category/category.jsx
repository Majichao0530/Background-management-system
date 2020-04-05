// 品类管理路由
import React, { Component } from "react";
import { Card, Table, Button, message, Modal } from "antd";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";

import LinkButton from "../../components/link-button";
import { reqCategorys, reqAddCategory, reqUpdateCategory } from "../../api";
import AddFrom from "./add-form";
import UPdateFrom from "./update-form";
import UpdateForm from "./update-form";

export default class Category extends Component {
  state = {
    categorys: [], // 一级分类列表
    subCategorys: [], // 二级分类列表
    loading: false,
    parentId: "0",
    parentName: "",
    showStatus: 0, // 添加/更新确认框状态 1添加 2更新
  };

  // 初始化表格列的数组
  initColumns = () => {
    this.columns = [
      {
        title: "分类的名称",
        dataIndex: "name",
      },
      {
        title: "操作",
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={this.showUpdate}>修改分类</LinkButton>
            {/* 解决如何向事件回调函数传递参数：
            先定义一个匿名箭头函数，在其中调用事件函数并传入参数 */}
            {this.state.parentId === "0" ? (
              <LinkButton onClick={() => this.showSubCategorys(category)}>
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        ),
      },
    ];
  };

  getCategorys = async () => {
    // 发请求前显示loading
    this.setState({ loading: true });
    const { parentId } = this.state;
    const result = await reqCategorys(parentId);
    // 请求完成后取消loading
    this.setState({ loading: false });
    if (result.status === 0) {
      const categorys = result.data;
      if (parentId === "0") {
        // 更新一级列表
        this.setState({ categorys });
      } else {
        // 更新二级列表
        this.setState({ subCategorys: categorys });
      }
    } else {
      message.error("获取分类列表失败");
    }
  };

  showSubCategorys = (category) => {
    // 更新状态
    // 解决setState异步更新问题
    // setState()不能立即获取最新的状态【异步更新状态】
    this.setState(
      {
        parentId: category._id,
        parentName: category.name,
      },
      () => {
        // 此函数在状态更新且重新render后执行
        console.log(this.state.parentId);
        // 获取二级分类列表
        this.getCategorys();
      }
    );
  };

  showCategorys = () => {
    this.setState({
      parentId: "0",
      parentName: "",
      subCategorys: [],
    });
  };

  // 显示添加
  showAdd = () => {
    this.setState({
      showStatus: 1,
    });
  };

  // 添加品类
  addCategory = () => {};

  // 显示更新
  showUpdate = () => {
    this.setState({
      showStatus: 2,
    });
  };

  // 更新品类名称
  updateCategory = () => {};

  // 关闭对话框回调函数
  handleCancel = () => {
    this.setState({
      showStatus: 0,
    });
  };

  componentWillMount() {
    this.initColumns();
  }

  // 发送异步ajax请求
  componentDidMount() {
    this.getCategorys();
  }

  render() {
    const {
      categorys,
      subCategorys,
      parentId,
      parentName,
      loading,
      showStatus,
    } = this.state;
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
          <ArrowRightOutlined style={{ marginRight: 5 }} />
          <span>{parentName}</span>
        </span>
      );

    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <PlusOutlined />
        添加
      </Button>
    );
    // const dataSource = [
    //   {
    //     parentId: "0",
    //     _id: "111aaa1",
    //     name: "家用电器",
    //     __v: 0
    //   }
    // ];

    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={parentId === "0" ? categorys : subCategorys}
          columns={this.columns}
          loading={loading}
          bordered
          rowKey="_id"
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddFrom />
        </Modal>
        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm />
        </Modal>
      </Card>
    );
  }
}
