// 商品管理的默认子路由
import React, { Component } from "react";
import { Card, Select, Input, Button, Table } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";

import LinkButton from "../../components/link-button";
const Option = Select.Option;

export default class ProductHome extends Component {
  state = {
    products: [
      {
        status: 1, // 0 在售 1下架
        imgs: [],
        _id: "5e8c46f31b127ca20df5fc90",
        categoryId: "5cf394d29929a304dcc0c6xx",
        name: "测试商品1",
        pCategoryId: "5ca9d6c0b49ef916541160bb",
        price: 10000,
        desc: "abc",
        __v: 0,
      },
    ], // 商品列表
  };

  // 初始化表头
  initColumns = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name",
      },
      {
        title: "商品描述",
        dataIndex: "desc",
      },
      {
        title: "价格",
        dataIndex: "price",
        render: (price) => "¥" + price,
      },
      {
        width: 100,
        title: "状态",
        dataIndex: "status",
        render: (status) => {
          return (
            <span>
              <span>在售</span>
              <Button type="primary">
                <MoneyCollectOutlined />
                下架
              </Button>
            </span>
          );
        },
      },
      {
        width: 100,
        title: "操作",
        render: (product) => {
          return (
            <span>
              <LinkButton>详情</LinkButton>
              <LinkButton>修改</LinkButton>
            </span>
          );
        },
      },
    ];
  };

  componentWillMount() {
    this.initColumns();
  }

  render() {
    const title = (
      <span>
        <Select value="0">
          <Option value="0">按名称搜索</Option>
          <Option value="1">按描述搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          style={{ width: 150, margin: "0 15px" }}
        ></Input>
        <Button type="primary">
          <SearchOutlined />
          搜索
        </Button>
      </span>
    );

    const extra = (
      <Button type="primary">
        <PlusOutlined />
        添加商品
      </Button>
    );

    const { products } = this.state;

    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey="_id"
          dataSource={products}
          columns={this.columns}
          bordered
        />
      </Card>
    );
  }
}
