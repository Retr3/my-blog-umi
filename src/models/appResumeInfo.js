import axios from "axios";
import { message } from 'antd';
function getResumeInfo(){
    return axios.get("/api/getResumeInfo").then(res=>{
        return {data:res.data.data}
    })
}
function setResumeInfo(formData){
    return axios.post("/api/setResumeInfo", {formData}).then(res=>{
        return {code:res.data.code}
    });
}
export default {
    namespace:"appResumeInfo",
    state:{
        resumeInfo:{}
    },
    effects:{
        *getResumeInfoFn(obj,{call, put}){
            try{
                const { data } = yield call(getResumeInfo);
                yield put({ type: "setResumeInfo", resumeInfo: data.resumeInfo });
            }catch(err){
                console.log(err);
            }
        },
        *addOrUpdateResumeInfo({formData,that},{call, put}){
            try{
                console.log(formData);
                const { code } = yield call(setResumeInfo,formData);
                if(code === 0){
                    message.success("简历修改成功");
                    yield put({type:"getResumeInfoFn"})
                    that.setState({
                        editStatus:false,
                        loading:false
                    })
                }else{
                    message.error("简历修改失败");
                    that.setState({
                        loading:false
                    })
                }
            }catch(err){
                console.log(err);
                message.error("简历修改失败");
                that.setState({
                    loading:false
                })
            }
        }
    },
    reducers:{
        setResumeInfo(state,action){
            return {resumeInfo:action.resumeInfo};
        }
    }
}