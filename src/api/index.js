// 包含项目中所有接口请求函数的模块
// 每个函数返回值都是promise

import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";

/*登录接口
export function reqLogin(username, password) {
  return ajax("/login", { username, password }, "POST");
}
改用箭头函数写函数
*/
export const reqLogin = (username, password) =>
  ajax("/login", { username, password }, "POST");

// 添加用户
export const reqAddUser = (user) => ajax("/manage/user/add", user, "POST");

// 获取一级或二级分类的列表
export const reqCategorys = (parentId) =>
  ajax("/manage/category/list", { parentId });

// 添加分类
export const reqAddCategory = (parentId, categoryName) =>
  ajax("/manage/category/add", { parentId, categoryName }, "POST");

// 更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) =>
  ajax("/manage/category/update", { categoryId, categoryName }, "POST");

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) =>
  ajax("/manage/product/list", { pageNum, pageSize });

// 获取分类
export const reqCategoryName = (categoryId) =>
  ajax("/manage/category/info", { categoryId });

// 更新商品状态（上架下架操作）
export const reqUpdateStatus = (productId, status) =>
  ajax("/manage/product/updateStatus", { productId, status }, "POST");

// 获取搜索商品分页列表
export const reqSearchProducts = ({
  pageNum,
  pageSize,
  searchName,
  searchType,
}) =>
  ajax("/manage/product/search", {
    pageNum,
    pageSize,
    [searchType]: searchName,
  });

// 删除已上传的图片
export const reqDeleteImg = (name) =>
  ajax("/manage/img/delete", { name }, "POST");

// 添加/修改商品
export const reqAddorUpdateProduct = (product) =>
  ajax("/manage/product/" + (product._id ? "update" : "add"), product, "POST");

// 获取所有角色列表
export const reqRoles = () => ajax("/manage/role/list");

// 添加角色
export const reqAddRole = (roleName) =>
  ajax("/manage/role/add", { roleName }, "POST");

// 更新角色
export const reqUpdateRole = (role) =>
  ajax("/manage/role/update", role, "POST");

// jsonp请求天气接口函数
export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
    jsonp(url, {}, (err, data) => {
      // 若jsonp请求成功
      if (!err && data.status === "success") {
        const { dayPictureUrl, weather } = data.results[0].weather_data[0];
        resolve({ dayPictureUrl, weather });
      } else {
        // 若jsonp请求失败
        message.error("获取天气信息失败");
      }
    });
  });
};
reqWeather("北京");
