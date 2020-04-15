// 商品管理的默认子路由
import React, { Component } from "react";
import { Card, Select, Input, Button, Table, message } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";

import { reqProducts, reqSearchProducts, reqUpdateStatus } from "../../api";
import LinkButton from "../../components/link-button";
import { PAGE_SIZE } from "../../utils/constants";
const Option = Select.Option;

export default class ProductHome extends Component {
  state = {
    products: [], // 商品列表
    total: 0, // 商品总数
    loading: false,
    searchName: "", // 搜索关键字
    searchType: "productName", // 搜索类型
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
        // dataIndex: "status",
        render: (product) => {
          const { status, _id } = product;
          return (
            <span>
              <span>{status === 1 ? "在售" : "已下架"}</span>
              <Button
                type="primary"
                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
              >
                <MoneyCollectOutlined />
                {status === 1 ? "下架" : "上架"}
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
              <LinkButton
                onClick={() =>
                  this.props.history.push("/product/detail", { product })
                }
              >
                详情
              </LinkButton>
              <LinkButton
                onClick={() => {
                  this.props.history.push("/product/addupdate", product);
                }}
              >
                修改
              </LinkButton>
            </span>
          );
        },
      },
    ];
  };

  //获取指定页码的商品列表
  getProducts = async (pageNum) => {
    this.pageNum = pageNum; // 保存每次请求的页数
    this.setState({ loading: true });
    const { searchName, searchType } = this.state;
    let result;
    if (searchName) {
      result = await reqSearchProducts({
        pageNum,
        pageSize: PAGE_SIZE,
        searchName,
        searchType,
      });
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE);
    }
    this.setState({ loading: false });
    // console.log(searchType);
    // console.log(result);
    if (result.status === 0) {
      const { list, total } = result.data;
      this.setState({
        total,
        products: list,
      });
    }
  };

  // 更新指定商品状态
  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status);
    if (result.status === 0) {
      message.success("商品状态已更改");
      this.getProducts(this.pageNum);
    }
  };

  componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getProducts(1);
  }

  render() {
    const { products, total, loading, searchName, searchType } = this.state;

    const title = (
      <span>
        <Select
          value={searchType}
          onChange={(value) => this.setState({ searchType: value })}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          style={{ width: 150, margin: "0 15px" }}
          value={searchName}
          onChange={(event) =>
            this.setState({ searchName: event.target.value })
          }
        ></Input>
        <Button type="primary" onClick={() => this.getProducts(1)}>
          <SearchOutlined />
          搜索
        </Button>
      </span>
    );

    const extra = (
      <Button
        type="primary"
        onClick={() => {
          this.props.history.push("/product/addupdate");
        }}
      >
        <PlusOutlined />
        添加商品
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey="_id"
          dataSource={products}
          columns={this.columns}
          bordered
          loading={loading}
          pagination={{
            current: this.pageNum,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            total,
            onChange: this.getProducts,
          }}
        />
      </Card>
    );
  }
}
