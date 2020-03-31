// 包含项目中所有接口请求函数的模块
// 每个函数返回值都是promise

import ajax from "./ajax";

/*登录接口
export function reqLogin(username, password) {
  return ajax("/login", { username, password }, "POST");
}
改用箭头函数写函数
*/
export const reqLogin = (username, password) =>
  ajax("/login", { username, password }, "POST");

// 添加用户
export const reqAddUser = user => ajax("/manage/user/add", user, "POST");
