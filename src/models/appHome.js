import axios from "axios";
import { DataView } from "@antv/data-set";
function appHomeStatic(){
    return axios.get("/api/oslist").then(res=>{
        return {data:res.data}
    })
}
function appHome(){
    return axios.get("/api/actionoslist").then(res=>{
        return {data:res.data}
    })
}
export default {
    namespace:"appHome",
    state:{
        staticList:[],
        actionInfo:{},
        loginrecord:[]
    },
    effects:{
        *homeStaticInfoFn(obj,{call, put}){
            try{
                const { data } = yield call(appHomeStatic);
                yield put({ type: "staticInit", staticInfo: data });
            }catch(err){

            }
        },
        *homeInfoFn({ msg },{call, put}){
            try{
                //const { data } = yield call(appHome);
                yield put({ type: "actionInit", actionInfo: msg });
            }catch(err){

            }
        }
    },
    reducers: {
        staticInit(state, action) {
          let staticList = [];
          staticList.push(`${action.staticInfo.type} ${action.staticInfo.arch} `);
          staticList.push(`${action.staticInfo.release}`); 
          staticList.push(`${action.staticInfo.cpus.split(' ')[action.staticInfo.cpus.split(' ').length-1]} ${action.staticInfo.cpucores}核`);
          staticList.push(action.staticInfo.totalmem);
          let loginrecord = action.staticInfo.loginrecord;
          return {...state, staticList, loginrecord};
        },
        actionInit(state, action) {
            const memDv = new DataView();
            const cpuDv = new DataView();
            console.log(action.actionInfo);
            let memData = [
                {
                item: "内存使用",
                value: parseInt(action.actionInfo.usemem)
                },
                {
                item: "内存空闲",
                value: parseInt(action.actionInfo.freemem)
                }]
            let cpuLoadData = [
                {
                item: "CPU使用",
                value: parseInt(action.actionInfo.cpuuse)
                },
                {
                item: "CPU空闲",
                value: parseInt(action.actionInfo.cpufree)
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
            const memRate = Number((action.actionInfo.usemem/(action.actionInfo.freemem + action.actionInfo.usemem)*100).toFixed(2));
            let cpuColor = action.actionInfo.cpuuse>50?(action.actionInfo.cpuuse>80?'#d6262f':'#ffc53d'):"#16e002";
            let meColor = memRate>50?(memRate>80?'#d6262f':'#ffc53d'):"#16e002";
            let actionInfo = {...action.actionInfo,memDv,cpuDv,cpuColor,meColor, memRate};
            let newActionInfo = {
                staticList:state.staticList,
                loginrecord:state.loginrecord,
                actionInfo
            }
            return newActionInfo;
          }
    }
}