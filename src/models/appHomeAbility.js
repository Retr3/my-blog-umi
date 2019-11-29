import axios from "axios";

function getAbilityInfo(){
    return axios.get("/api/appHomeAbility").then(res=>{
        return {data:res.data.data}
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
                yield put({ type: "abilityInit", ability: data });
            }catch(err){

            }
        }
    },
    reducers:{
        abilityInit(state,action){
            return {chartData:action.ability.chartData};
        }
    }
}