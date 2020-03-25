import axios from "axios";
import { message } from 'antd';
//获取前台访客信息表
function getShowVisitorInfo({page, pagesize}){
    return axios.get("/api/visitor", {params:{page, pagesize}}).then(res=>{
        return {listData:res.data};
    });
}
//获取后台登录信息表
function getLoginVisitorInfo({page, pagesize}){
    return axios.get('/api/loginrecord', {params:{page, pagesize}}).then(res=>{
        return {listData:res.data};
    });
}
//获取静态数据
function getVisitorStaticInfo(){
    return axios.get('/api/visitorstatic').then(res=>{
        return {staticData:res.data}
    });
}
//获取后台30天登陆数
function getLoginStaticInfo(){
    return axios.get('/api/loginrecordcount').then(res=>{
        return {loginData:res.data.count}
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
        *getShowVisitorInfoFn({page, pagesize},{call,put}){
            try{
                const { listData } = yield call(getShowVisitorInfo,{page, pagesize});
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
        *getLoginVisitorInfoFn({page, pagesize},{call,put}){
            try{
                const { listData } = yield call(getLoginVisitorInfo,{page, pagesize});
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
                const { loginData } = yield call(getLoginStaticInfo);
                if(staticData && loginData){
                    staticData.loginData = loginData;
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