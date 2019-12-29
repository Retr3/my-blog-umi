import axios from "axios";
import router from "umi/router";
import { notification } from "antd";
const userinfo = JSON.parse(localStorage.getItem('userinfo')) || {
    token: "",
    role: "",
    username: ""
  };
// api
function appLogin(payload) {
    return axios.post("/api/appLogin", payload).then(res=>{
        return {code:res.data.code,userinfo:res.data.data,msg:res.data.msg}
    });
}
export default {
    namespace: "appLogin", // 可省略
    state: userinfo, // 初始状态：缓存或空对象
    effects: {
      // action: user/login
      *login({ payload }, { call, put }) {
        try {
          let redirect = payload.redirect;
          const {userinfo,code,msg} = yield call(appLogin, payload);
            if(code === 0){
              // 登录成功: 缓存用户信息
              localStorage.setItem("userinfo", JSON.stringify(userinfo));
              yield put({ type: "init", payload: userinfo });
              //重定向
              if(redirect){
                router.push(redirect);
              }else{
                router.push("/index");
              }
            }else if(code === -1){
              let formObj = payload.formObj;
              formObj.setFields({
                username: {
                  value: payload.username,
                  errors: [new Error(msg)]
                }
              })
            }else{
              let formObj = payload.formObj;
              formObj.setFields({
                password: {
                  value: payload.password,
                  errors: [new Error(msg)]
                }
              })
            }
        } catch (error) {
        }
      },
      *logoutFn(obj,{ call, put}){
        //以后登出可能会与后台有交互？？
        try{
          yield put({ type: "logout"});
          notification.success({message:'注销成功',duration:1});
          router.push("/login");
        }catch(err){
          notification.error({message:'注销失败',duration:1});
        }
      }
    },
    reducers: {
      init(state, action) {
        // 覆盖旧状态
        return action.payload;
      },
      logout(state,actin){
        localStorage.removeItem('userinfo');
        return {
          token: "",
          role: "",
          username: "",
          balance: 0
        }
      }
    }
  };