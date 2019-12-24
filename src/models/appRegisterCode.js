import axios from "axios";
import { message } from 'antd';
function getRegisterCode(){
    return axios.get("/api/getRegisterCode").then(res=>{
        return {codeStr:res.data.codeStr};
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
                const { codeStr } = yield call(getRegisterCode);
                if(codeStr){
                    yield put({ type: "setCode",codeStr});
                }else{
                    message.error(`注册码生成失败`);
                }
            }catch(err){
                message.error(`注册码生成失败`);
            }
        }
    },
    reducers:{
        setCode(state,action){
            return {registerCode:action.codeStr}
        }
    }
}