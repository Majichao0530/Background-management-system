// 商品管理的添加和更新的子路由
import React, { Component } from "react";
import { Card, Input, Form, Cascader, Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import LinkButton from "../../components/link-button";
import { reqCategorys, reqAddorUpdateProduct } from "../../api/index";
import PicturesWall from "./pictures-wall";
import RichTextEditor from "./rich-text-editor";

const { Item } = Form;
const { TextArea } = Input;

export default class ProductAddProduct extends Component {
  formRef = React.createRef();

  state = {
    options: [],
  };

  constructor(props) {
    super(props);

    // 创建用来保存ref标识的标签对象容器
    this.pw = React.createRef();
    this.editor = React.createRef();
  }

  // 整理分类列表数据得到所需值和名称
  initOptions = async (categorys) => {
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }));

    // 二级分类商品更新需要加载二级分类列表
    const { updateFlag, product } = this;
    const { pCategoryId } = product;
    if (updateFlag && pCategoryId !== "0") {
      // 获取二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      const childOptions = subCategorys.map((c) => ({
        label: c.name,
        value: c._id,
        isLeaf: true,
      }));

      // 找到一份分类目标
      const targetOption = options.find(
        (option) => option.value === pCategoryId
      );
      // 关联二级列表到一级分类目标
      targetOption.children = childOptions;
    }

    this.setState({ options });
  };

  // 发送ajax请求异步得到一级/二级分类列表
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      const categorys = result.data;
      // 判断一级/二级分类列表
      if (parentId === 0) {
        this.initOptions(categorys);
      } else {
        return categorys;
      }
    }
  };

  // 发送表单验证
  submit = () => {
    this.formRef.current.validateFields().then(async (values) => {
      const { name, desc, price, ids } = values;
      let pCategoryId, categoryId;
      if (ids.length === 1) {
        pCategoryId = "0";
        categoryId = ids[0];
      } else {
        pCategoryId = ids[0];
        categoryId = ids[1];
      }
      const imgs = this.pw.current.getImgs();
      const detail = this.editor.current.getDetail();
      const product = {
        name,
        desc,
        price,
        pCategoryId,
        categoryId,
        imgs,
        detail,
      };
      console.log(product);
      // 如果是更新，需要添加_id
      if (this.updateFlag) {
        product._id = this.product._id;
      }
      // 调用接口函数添加/更新商品
      const result = await reqAddorUpdateProduct(product);
      console.log(result);
      if (result.status === 0) {
        message.success(`${this.updateFlag ? "更新" : "添加"}商品成功`);
        this.props.history.goBack();
      } else {
        message.error(`${this.updateFlag ? "更新" : "添加"}商品失败`);
      }
    });
  };

  // 验证价格函数
  validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      return Promise.resolve();
    } else {
      return Promise.reject("价格必须大于0");
    }
  };

  // 动态加载分类数据
  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // 获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value);
    if (subCategorys && subCategorys.length > 0) {
      const childOptions = subCategorys.map((c) => ({
        label: c.name,
        value: c._id,
        isLeaf: true,
      }));
      targetOption.children = childOptions;
    } else {
      // 当前分类没有二级分类 修改isleaf
      targetOption.isLeaf = true;
    }

    // 加载二级分类列表
    setTimeout(() => {
      targetOption.loading = false;
      this.setState({
        options: [...this.state.options],
      });
    }, 200);
  };

  componentWillMount() {
    // 取出携带的product
    const product = this.props.location.state;
    // 保存是否为更新模式的flag
    this.updateFlag = !!product; // !!用来强制转换为布尔值
    // 保存携带的product或创建空对象
    this.product = product || {};
  }

  componentDidMount() {
    this.getCategorys(0);
  }

  render() {
    const { updateFlag, product } = this;
    const { pCategoryId, categoryId, imgs, detail } = product;
    const ids = [];
    if (updateFlag) {
      if (pCategoryId === "0") {
        ids.push(categoryId);
      } else {
        ids.push(pCategoryId);
        ids.push(categoryId);
      }
    }
    const formItemLayout = {
      labelCol: { span: 1.5 },
      wrapperCol: { span: 8 },
    };
    const title = (
      <span>
        <LinkButton>
          <ArrowLeftOutlined
            style={{ fontSize: 18 }}
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </LinkButton>
        <span>{updateFlag ? "修改商品" : "添加商品"}</span>
      </span>
    );
    // ["5e885b3d57f886da78f96700", "5e8b4b70fc739270b9ebb594"]
    return (
      <Card title={title}>
        <Form
          {...formItemLayout}
          ref={this.formRef}
          initialValues={{
            name: product.name,
            desc: product.desc,
            price: product.price,
            ids: ids,
            imgs: imgs,
          }}
        >
          <Item
            label="商品名称"
            name="name"
            rules={[{ required: true, message: "商品名称不能为空" }]}
          >
            <Input placeholder="请输入商品名称" />
          </Item>
          <Item
            label="商品描述"
            name="desc"
            rules={[{ required: true, message: "商品名称不能为空" }]}
          >
            <TextArea
              placeholder="请输入商品描述"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Item>
          <Item
            label="商品价格"
            name="price"
            rules={[
              { required: true, message: "商品价格不能为空" },
              { validator: this.validatePrice },
            ]}
          >
            <Input type="number" placeholder="请输入商品价格" addonAfter="元" />
          </Item>
          <Item
            label="商品分类"
            name="ids"
            rules={[{ required: true, message: "商品分类不能为空" }]}
          >
            <Cascader
              placeholder="请选择商品分类"
              options={this.state.options}
              loadData={this.loadData}
            />
          </Item>
          <Item label="商品图片" name="imgs">
            <PicturesWall ref={this.pw} />
          </Item>
          <Item
            label="商品详情"
            labelCol={{ span: 1.5 }}
            wrapperCol={{ span: 20 }}
          >
            <RichTextEditor ref={this.editor} detail={detail} />
          </Item>
          <Button type="primary" onClick={this.submit}>
            提交
          </Button>
        </Form>
      </Card>
    );
  }
}
