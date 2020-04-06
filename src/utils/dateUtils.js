// 日期时间处理的工具函数模块

// 格式化日期
export function formatDate(time) {
  if (!time) return "";
  let date = new Date(time);
  function formatZero(num, len) {
    if (num.length > len) return num;
    return (Array(len).join(0) + num).slice(-len);
  }
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    formatZero(date.getMinutes(), 2) +
    ":" +
    formatZero(date.getSeconds(), 2)
  );
}
