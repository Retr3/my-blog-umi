import axios from "axios";
import getLocation from '../utils/fixedPosition.js';
import getFootprint from '../utils/getFootprint.js';
import { message, notification } from 'antd';
//获取黑名单列表
function getBlackList(){
    return axios.get("/api/blacklist").then(res=>{
        return {data:res.data};
    });
}
//添加黑名单
function addBlackListInfo(ip,location){
    return axios.post("/api/blacklist",{ip,location}).then(res=>{
        return {code:res.data.code, message: res.data.msg};
    });
}
//删除黑名单
function delBlackListInfo(ip){
    return axios.delete(`/api/blacklist/${ip}`).then(res=>{
        return {code:res.data.code, message: res.data.msg};
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
                const fixIp = yield getLocation();
                let location = '无定位';
                if( fixIp ){
                  const footprint = yield getFootprint(fixIp);
                  location = !!footprint? footprint.ad_info.nation+footprint.ad_info.province+footprint.ad_info.city : '无定位';
                }
                const { code, message } = yield call(addBlackListInfo,ip,location);
                switch (code) {
                    case 0:
                      notification.success({message, duration:1});
                      yield put({ type: "getBlackListFn"});
                      break;
                    case -1:
                      notification.warning({message, duration:1});
                      break;
                    default:
                      notification.error({message, duration:1});
                      break;
                }
            }catch(err){
                console.log(err);
                notification.error({message: '黑名单添加异常',duration:1});
            }
        },
        *addBlackListForVisitFn({ip, location},{call,put}){
            try{
                let newLocation = !!location ?location:'无定位';
                const { code, message } = yield call(addBlackListInfo,ip,newLocation);
                switch (code) {
                    case 0:
                      notification.success({message, duration:1});
                      yield put({ type: "getBlackListFn"});
                      break;
                    case -1:
                      notification.warning({message, duration:1});
                      break;
                    default:
                      notification.error({message, duration:1});
                      break;
                }
            }catch(err){
                console.log(err);
                notification.error({message: '黑名单添加异常',duration:1});
            }
        },
        *delBlackListInfoFn({ip},{call,put}){
            try{
                const { code, message } = yield call(delBlackListInfo,ip);
                if(code === 0){
                    notification.success({message,duration:1});
                    yield put({ type: "getBlackListFn"});
                }else{
                    notification.error({message,duration:1});
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