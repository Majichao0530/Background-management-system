// 商品管理路由
import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import ProductHome from "./home";
import ProductAddProduct from "./add-update";
import ProductDetail from "./detail";

export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/product" component={ProductHome} />
        <Route path="/product/addupdate" component={ProductAddProduct} />
        <Route path="/product/detail" component={ProductDetail} />
        <Redirect to="/product" />
      </Switch>
    );
  }
}
