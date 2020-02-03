import axios from "axios";
import { message } from 'antd';
function appRegister(payload) {
    return axios.post("/api/register", payload).then(res=>{
        return {code:res.data.code,msg:res.data.message}
    });
}
function appValidateCode(code){
    return axios.get(`/api/code/${code}`).then(res =>{
        return {isCode: res.data};
    })
}
export default {
    namespace:"appRegister",
    state:'',
    effects:{
        *registerFn({ registerInfo },{call, put}){
            try{
                const { isCode } = yield call(appValidateCode, registerInfo.invitation);
                if(isCode){
                    const { code, msg } = yield call(appRegister, registerInfo);
                    let formObj = registerInfo.formObj;
                    if(code === 0){
                        message.success("注册成功")
                        formObj.resetFields();
                    }else if(code === -1){
                    
                        formObj.setFields({
                            registerUsername: {
                            value: registerInfo.registerUsername,
                            errors: [new Error(msg)]
                            }
                        })
                    }else{
                        message.success("注册失败")
                    }
                }else{
                    registerInfo.formObj.setFields({
                        invitation: {
                            value: registerInfo.invitation,
                            errors: [new Error('邀请码错误')]
                        }
                    })
                }
                
            }catch(err){

            }
        }
    }
}