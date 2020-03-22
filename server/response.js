// 请求状态码
const statusCode = {
  success: 200,
  cached: 304,
  error: 400,
  noToken: 401,
  noPermission: 403,
  noResource: 404,
  timeout: 408,
  serverError: 500,
  netError: 502
};

// 请求提示
const message = {
  success: "请求成功！",
  cached: "资源已缓存!",
  error: "请求失败！",
  noToken: "请求缺少必要的Token!",
  noPermission: "请求的资源不允许访问！",
  noResource: "请求的资源不存在!",
  timeout: "请求超时！",
  serverError: "服务器错误，请通知管理员!",
  netError: "网关错误，请检查网络是否连接!"
};

// 成功
const success = {
  status: statusCode.success,
  message: message.success,
  success: true
};

// 失败
const error = {
  status: statusCode.error,
  message: message.error,
  success: false
};

// 失败
const timeout = {
  status: statusCode.timeout,
  message: message.timeout,
  success: false
};

module.exports = {
  statusCode,
  message,
  success,
  error,
  timeout
};
