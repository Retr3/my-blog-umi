import axios from "axios";
import { message, notification } from 'antd';
function getTagsInfo(userid){
    return axios.get(`/api/articletags/${userid}`).then(res=>{
        return {data:res.data};
    });
}
function updateTagsInfo(tags){
    return axios.post("/api/articletags",{tags}).then(res=>{
        return {code:res.data.code, tagsInfo: res.data.tagsInfo};
    });
}
function delTagsInfo(id){
    return axios.delete(`/api/articletags/${id}`).then(res=>{
        return {code:res.data.code};
    });
}
export default {
    namespace:"appTags",
    state:{
        tags:[]
    },
    effects:{
        *getTagsFn(obj,{call,put}){
            try{
                const { data } = yield call(getTagsInfo, JSON.parse(window.localStorage.getItem('userinfo')).userid);
                if(data){
                    yield put({ type: "setTags",data});
                }else{
                    message.error(`标签信息初始化失败`);
                }
            }catch(err){
                console.log(err);
                message.error(`标签信息初始化失败`);
            }
        },
        *updateTagsFn({tags},{call,put}){
            try{
                const { code } = yield call(updateTagsInfo,tags);
                if(code === 0){
                    notification.success({message: '标签修改成功',duration:1});
                }else{
                    notification.error({message: '标签修改失败',duration:1});
                }
            }catch(err){
                console.log(err);
                notification.error({message: '标签修改异常',duration:1});
            }
        },
        *delTagsFn({id},{call, put}){
            try{
                const { code } = yield call(delTagsInfo,id);
                if(code === 0){
                    notification.success({message: '标签删除成功',duration:1});
                    yield put({ type: "delTags",id});
                }else{
                    notification.error({message: '标签删除失败',duration:1});
                }
            }catch(err){
                console.log(err);
                notification.error({message: '标签删除失败',duration:1});
            }
        }
    },
    reducers:{
        setTags(state,action){
            return {tags:action.data}
        },
        delTags(state, action){
            const tagsInfo = state.tags.filter(tag => tag.id !== action.id)
            return {tags:tagsInfo}
        }
    }
}