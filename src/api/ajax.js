/* 
   发送异步ajax请求的模块函数
   封装axios库
   函数返回值是一个promise对象
   ajax优化：统一处理请求异常，在外层包裹一个自行创建的Promise对象
*/

import axios from "axios";
import { message } from "antd";

export default function ajax(url, data = {}, type = "GET") {
  return new Promise((resolve, reject) => {
    let promise;
    // 执行ajax异步操作
    if (type === "GET") {
      promise = axios.get(url, {
        params: data
      });
    } else {
      // POST请求
      promise = axios.post(url, data);
    }
    // 成功后调用resolve
    promise
      .then(response => {
        resolve(response.data);
        // 失败后提示异常信息
      })
      .catch(error => {
        message.error("请求出错了：" + error.message);
      });
  });
}
