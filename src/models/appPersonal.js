import axios from "axios";
import { message } from 'antd';
function updatePersonalInfo(payload){
    return axios.put("/api/subscriber",payload).then(res=>{
        return {code: res.data.code, message: res.data.msg};
    });
}
export default {
    namespace:'appPersonal',
    state:{},
    effects:{
        *updatePersonalInfoFn({ personalInfo },{call,put}){
            try{
                const { code, message } = yield call(updatePersonalInfo, personalInfo);
                if(code === 0){
                    localStorage.setItem("userinfo", JSON.stringify(personalInfo));
                    message.success("信息修改成功");
                }else{
                    message.error(`注册码生成失败`);
                }
            }catch(err){
                message.error(`注册码生成失败`);
            }
        }
    }
}