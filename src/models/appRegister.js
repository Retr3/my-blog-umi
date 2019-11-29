import axios from "axios";
import { message } from 'antd';
function appRegister(payload) {
    return axios.post("/api/appRegister", payload).then(res=>{
        return {code:res.data.code,msg:res.data.msg}
    });
}
export default {
    namespace:"appRegister",
    state:'',
    effects:{
        *registerFn({ registerInfo },{call, put}){
            try{
                const { code, msg } = yield call(appRegister, registerInfo);
                let formObj = registerInfo.formObj;
                if(code === 0){
                    message.success("注册成功")
                    formObj.resetFields();
                }else{
                   
                    formObj.setFields({
                        registerUsername: {
                          value: registerInfo.registerUsername,
                          errors: [new Error(msg)]
                        }
                      })
                }
            }catch(err){

            }
        }
    }
}