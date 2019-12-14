import axios from "axios";
import { message, notification } from 'antd';
//获取黑名单列表
function getBlackList(){
    return axios.get("/api/getBlackList").then(res=>{
        return {data:res.data.data};
    });
}
//添加黑名单
function addBlackListInfo(ip){
    return axios.post("/api/addBlackListInfo",{ip}).then(res=>{
        return {code:res.data.code};
    });
}
//删除黑名单
function delBlackListInfo(ip){
    return axios.post("/api/delBlackListInfo",{ip}).then(res=>{
        return {code:res.data.code};
    });
}
export default {
    namespace:"appBlackList",
    state:{
        blackListInfo:[]
    },
    effects:{
        //获取前台访客记录
        *getBlackListFn(obj,{call,put}){
            try{
                const { data } = yield call(getBlackList);
                if(data){
                    yield put({ type: "setBlackListInfo",data});
                }else{
                    message.error(`黑名单初始化失败`);
                }
            }catch(err){
                console.log(err);
                message.error(`黑名单初始化失败`);
            }
        },
        *addBlackListInfoFn({ip},{call,put}){
            try{
                const { code } = yield call(addBlackListInfo,ip);
                if(code === 0){
                    notification.success({message: '黑名单添加成功',duration:1});
                    yield put({ type: "getBlackListFn"});
                }else{
                    notification.error({message: '黑名单添加失败',duration:1});
                }
            }catch(err){
                console.log(err);
                notification.error({message: '黑名单添加异常',duration:1});
            }
        },
        *delBlackListInfoFn({ip},{call,put}){
            try{
                const { code } = yield call(delBlackListInfo,ip);
                if(code === 0){
                    notification.success({message: '成功移出黑名单',duration:1});
                    yield put({ type: "getBlackListFn"});
                }else{
                    notification.error({message: '移出黑名单失败',duration:1});
                }
            }catch(err){
                console.log(err);
                notification.error({message: '移出黑名单异常',duration:1});
            }
        }
    },
    reducers:{
        setBlackListInfo(state,action){
            return {blackListInfo:action.data}
        }
    }
}