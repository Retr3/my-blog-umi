import axios from "axios";
import { message } from 'antd';
function appRePassword(payload) {
    return axios.post("/api/appRePassword", payload).then(res=>{
        return {code:res.data.code}
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
              const {code} = yield call(appRePassword,payload);
              console.log(code);
                if(code === 0){
                    message.success(`密码修改成功,下次登录时生效`);
                    yield put({ type: "changeErrorFlag",code})
                }else{
                    yield put({ type: "changeErrorFlag",code})
                    message.error(`旧密码错误`);
                }
            } catch (error) {
                message.error(`密码修改出错`);
            }
          }
    },
    reducers: {
        changeErrorFlag(state,action){
            console.log(action);
            return {errorFlag:action.code}
        }
    }
}