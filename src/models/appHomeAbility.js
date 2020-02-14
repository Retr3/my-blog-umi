import axios from "axios";

function getAbilityInfo(){
    return axios.get("/api/loadavg").then(res=>{
        return {data:res.data}
    })
}

export default {
    namespace:"appHomeAbility",
    state:{
        chartData:[]
    },
    effects:{
        *appAbilityFn(obj,{call, put}){
            try{
                const { data } = yield call(getAbilityInfo);
                const newData = [];
                data.forEach(item=>{
                    const day = item.date.split(' ')[0].split('-')[1]+'-'+item.date.split(' ')[0].split('-')[2]+'/'+item.date.split(' ')[1]
                    newData.push({day,type:'内存使用率',percentage:Number(item.memoryper_forms)},
                        {day,type:'CPU使用率',percentage:Number(item.cpuper_forms)})
                })
                console.log(newData);
                yield put({ type: "abilityInit", newData });
            }catch(err){
                console.log(err);
            }
        }
    },
    reducers:{
        abilityInit(state,action){
            return {chartData:action.newData};
        }
    }
}