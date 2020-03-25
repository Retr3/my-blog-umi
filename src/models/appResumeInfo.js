import axios from "axios";
import { message } from 'antd';
function getResumeInfo(userid){
    return axios.get(`/api/resumeInfo/${userid}`).then(res=>{
        return {data:res.data}
    })
}
function createResumeInfo(payload){
    return axios.post(`/api/resumeInfo`,payload).then(res=>{
        return {newResumeInfo:res.data}
    })
}
function setResumeInfo(payload){
    return axios.put(`/api/resumeInfo/${payload.resumeId}`, {...payload.formData}).then(res=>{
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
                const userid = JSON.parse(window.localStorage.getItem('userinfo')).userid;
                let { data } = yield call(getResumeInfo, userid);
                if(!(!!data)){
                    const { newResumeInfo } = yield call(createResumeInfo, {userid, name: JSON.parse(window.localStorage.getItem('userinfo')).username })
                    data = newResumeInfo;
                }
                yield put({ type: "setResumeInfo", resumeInfo: data });
            }catch(err){
                console.log(err);
            }
        },
        *updateResumeInfo({formData, resumeId, that},{call, put}){
            try{
                const { code } = yield call(setResumeInfo,{formData,resumeId});
                if(code === 0){
                    that.resumeInit();
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