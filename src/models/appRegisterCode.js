import axios from "axios";
import { message } from 'antd';
function getRegisterCode(){
    return axios.post("/api/code").then(res=>{
        return {code: res.data.code, codeInfo: res.data.codeInfo};
    });
}
export default {
    namespace:'appRegisterCode',
    state:{
        registerCode:''
    },
    effects:{
        *getRegisterCodeFn(obj,{call,put}){
            try{
                const { code, codeInfo } = yield call(getRegisterCode);
                if(code === 0){
                    yield put({ type: "setCode",codeInfo});
                }else{
                    yield put({ type: "setCode",codeInfo});
                    message.error(`注册码生成失败`);
                }
            }catch(err){
                message.error(`注册码生成失败`);
            }
        }
    },
    reducers:{
        setCode(state,action){
            return {registerCode:action.codeInfo}
        }
    }
}