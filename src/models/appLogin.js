import axios from "axios";
import router from "umi/router";
import { notification } from "antd";
import ipKey from '../utils/sysKeys.js';
const userinfo = JSON.parse(localStorage.getItem('userinfo')) || {
    nickname: "",
    username: "",
    userid: "",
    sign: "",
    occupation: "",
    company: "",
    location: "",
    team: "",
    imagepath: ""
  };
// api
function appLogin(payload) {
    return axios.post("/api/login", payload).then(res=>{
        return {code: res.data.code,userinfo: res.data.userInfo,msg: res.data.msg, token: res.data.token}
    });
}
function getLocation(){
  return axios.get(`/ws/location/v1/ip`,{
    params:{
      key:ipKey
    },
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }).then(res=>{
    if(res.data.status === 0){
      return res.data.result
    }else{
      return null
    }
  })
}
function loginRecord(payload){
  return axios.post("/api/loginrecord", payload).then(res=>{
    return {code: res.data.code, msg: res.data.msg }
  })
}
export default {
    namespace: "appLogin", // 可省略
    state: userinfo, // 初始状态：缓存或空对象
    effects: {
      // action: user/login
      *login({ payload }, { call, put }) {
        try {
          let redirect = payload.redirect;
          const {code, userinfo, msg, token} = yield call(appLogin,{username: payload.username, password: payload.password});
            if(code === 0){
              let loginIp = '0.0.0.0';
              let loginPlace = '无定位';
              // 登录成功: 缓存用户信息
              localStorage.setItem("userinfo", JSON.stringify(userinfo));
              localStorage.setItem("token", token);
              yield put({ type: "init", payload: userinfo });
              //获取定位
              const location = yield call(getLocation);
              if(location){
                const { ip, ad_info } = location;
                loginIp = ip;
                loginPlace = ad_info.nation+ad_info.province+ad_info.city;
              }
              //添加定位，定位失败也需要添加
              yield call(loginRecord, { login_place: loginPlace, login_ip: loginIp, userid: userinfo.userid })
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
        localStorage.removeItem('token');
        return {
          nickname: "",
          username: "",
          userid: "",
          sign: "",
          occupation: "",
          company: "",
          location: "",
          team: "",
          imagepath: ""
        }
      }
    }
  };