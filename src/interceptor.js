import axios from "axios";
import { notification } from "antd";

const codeMessage = {
    202: "一个请求已经进入后台排队（异步任务）。",
    302: "对象已移动",
    304: "未修改",
    307: "临时重定向",
    400: "错误的请求",
    401: "用户没有权限（令牌、用户名、密码错误）",
    403: "禁止访问",
    404: "请求不存在",
    405: "用来访问本页面的 HTTP方法不被允许",
    406: "客户端浏览器不接受所请求页面的MIME类型",
    407: "需进行代理身份验证",
    412: "前提条件失败",
    413: "请求实体太大",
    414: "请求 URI 太长",
    415: "不支持的媒体类型",
    416: "所请求的范围无法满足",
    417: "执行失败",
    423: "锁定的错误",
    500: "服务器发生错误",
    501: "页眉值指定了未实现的配置",
    502: "服务器网关或代理服务器收到了无效响应",
    503: "服务不可用",
    504: "网关超时",
    505: "HTTP 版本不受支持"
};
//请求拦截器，如果存在token则将token加入请求头
axios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem("token");
    if (token) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      // Bearer是JWT的认证头部信息
      config.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
// 仅拦截异常状态响应
axios.interceptors.response.use(null, ({ response }) => {
  if (codeMessage[response.status]) {
    if(response.status === 401){
      window.localStorage.removeItem("userinfo");
      window.localStorage.removeItem("token");
    }
    notification.error({
        duration:2,
        message: `请求错误 ${response.status}: ${response.config.url}`,
        description: codeMessage[response.status]
    });
  }
  return Promise.reject(codeMessage[response.status]);
});
