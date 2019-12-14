import axios from "axios";
import { message } from 'antd';
//获取前台访客信息表
function getShowVisitorInfo(){
    return axios.get("/api/getShowVisitorInfo").then(res=>{
        return {listData:res.data.data};
    });
}
//获取后台登录信息表
function getLoginVisitorInfo(){
    return axios.get('/api/getLoginVisitorInfo').then(res=>{
        return {listData:res.data.data};
    });
}
//获取静态数据
function getVisitorStaticInfo(){
    return axios.get('/api/getVisitorStaticInfo').then(res=>{
        return {staticData:res.data.data}
    });
}
export default {
    namespace:"appVisitor",
    state:{
        showVisitorInfo:[],
        loginVisitorInfo:[],
        staticData:''
    },
    effects:{
        //获取前台访客记录
        *getShowVisitorInfoFn(obj,{call,put}){
            try{
                const { listData } = yield call(getShowVisitorInfo);
                if(listData){
                    yield put({ type: "setShowVisitorInfo",listData});
                }else{
                    message.error(`数据查询失败`);
                }
            }catch(err){
                console.log(err);
                message.error(`数据查询失败`);
            }
        },
        *getLoginVisitorInfoFn(obj,{call,put}){
            try{
                const { listData } = yield call(getLoginVisitorInfo);
                if(listData){
                    yield put({ type: "setLoginVisitorInfo",listData});
                }else{
                    message.error(`数据查询失败`);
                }
            }catch(err){
                console.log(err);
                message.error(`数据查询失败`);
            }
        },
        *getVisitorStaticInfoFn(obj,{call,put}){
            try{
                const { staticData } = yield call(getVisitorStaticInfo);
                if(staticData){
                    yield put({ type: "setVisitorStaticInfo",staticData});
                }else{
                    message.error(`数据查询失败`);
                }
            }catch(err){
                console.log(err);
                message.error(`数据查询失败`);
            }
        }
    },
    reducers:{
        setShowVisitorInfo(state,action){
            let newState = state;
            newState.showVisitorInfo = action.listData;
            return newState
        },
        setLoginVisitorInfo(state,action){
            let newState = state;
            newState.loginVisitorInfo = action.listData;
            // const showVisitorInfo = state.showVisitorInfo;
            return newState
        },
        setVisitorStaticInfo(state,action){
            let newState = state;
            newState.staticData = action.staticData;
            return newState;
        }
    }
}