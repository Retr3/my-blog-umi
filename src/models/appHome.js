import axios from "axios";
import { DataView } from "@antv/data-set";
function appHomeStatic(){
    return axios.get("/api/appHomeStaticInfo").then(res=>{
        return {data:res.data.data}
    })
}
function appHome(){
    return axios.get("/api/appHomeInfo").then(res=>{
        return {data:res.data.data}
    })
}
export default {
    namespace:"appHome",
    state:{
        staticList:[],
        actionInfo:{}
    },
    effects:{
        *homeStaticInfoFn(obj,{call, put}){
            try{
                const { data } = yield call(appHomeStatic);
                yield put({ type: "staticInit", staticInfo: data });
            }catch(err){

            }
        },
        *homeInfoFn(obj,{call, put}){
            try{
                const { data } = yield call(appHome);
                yield put({ type: "actionInit", actionInfo: data });
            }catch(err){

            }
        }
    },
    reducers: {
        staticInit(state, action) {
          let staticList = [];
          staticList.push(`${action.staticInfo.type} ${action.staticInfo.arch} `);
          staticList.push(`${action.staticInfo.release}`); 
          staticList.push(`${action.staticInfo.cpusmodel} ${action.staticInfo.cpuslength}核`);
          staticList.push(action.staticInfo.totalmem);
          return {...state,staticList};
        },
        actionInit(state, action) {
            const memDv = new DataView();
            const cpuDv = new DataView();
            let memData = [
                {
                item: "内存使用",
                value: parseInt(action.actionInfo.useMem)
                },
                {
                item: "内存空闲",
                value: parseInt(action.actionInfo.freemem)
                }]
            let cpuLoadData = [
                {
                item: "CPU使用",
                value: parseInt(action.actionInfo.cpuLoad)
                },
                {
                item: "CPU空闲",
                value: 100-parseInt(action.actionInfo.cpuLoad)
                }]    
            memDv.source(memData).transform({
                type: "percent",
                field: "value",
                dimension: "item",
                as: "percent"
            });
            cpuDv.source(cpuLoadData).transform({
                type: "percent",
                field: "value",
                dimension: "item",
                as: "percent"
            });
            let cpuColor = action.actionInfo.cpuLoad>50?(action.actionInfo.cpuLoad>80?'#d6262f':'#ffc53d'):"#16e002";
            let meColor = action.actionInfo.MemRate>50?(action.actionInfo.MemRate>80?'#d6262f':'#ffc53d'):"#16e002";
            let actionInfo = {...action.actionInfo,memDv,cpuDv,cpuColor,meColor};
            let newActionInfo = {
                staticList:state.staticList,
                actionInfo
            }
            return newActionInfo;
          }
    }
}