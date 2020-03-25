import axios from "axios";
import { message } from 'antd';
function appRePassword(payload) {
    return axios.put(`/api/subscriberinfo/${payload.userid}`, payload.password).then(res=>{
        return { code:res.data.code, msg: res.data.msg };
    });
}
export default {
    namespace: "appRePassword",
    state: {
        errorFlag:0
    }, 
    effects: {
        *rePasswordFn({ payload }, { call, put }) {
            try {
              const data = { userid: JSON.parse(window.localStorage.getItem('userinfo')).userid, password: payload };
              const {code} = yield call(appRePassword,data);
                if(code === 0){
                    message.success(`密码修改成功,下次登录时生效`);
                    yield put({ type: "changeErrorFlag",code})
                }else if(code === -2){
                    yield put({ type: "changeErrorFlag",code})
                    message.error(`旧密码错误`);
                }else{
                    message.error(`密码修改出错`);
                }
            } catch (error) {
                message.error(`密码修改出错`);
            }
          }
    },
    reducers: {
        changeErrorFlag(state,action){
            return {errorFlag:action.code}
        }
    }
}