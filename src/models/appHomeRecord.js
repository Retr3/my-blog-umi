import axios from "axios";

function getRecordInfo(){
    return axios.get("/api/appHomeRecord").then(res=>{
        return {data:res.data.data}
    })
}

export default {
    namespace:"appHomeRecord",
    state:{
        loginRecordData:[]
    },
    effects:{
        *appRecordFn(obj,{call, put}){
            try{
                const { data } = yield call(getRecordInfo);
                yield put({ type: "recordInit", loginRecord: data });
            }catch(err){

            }
        }
    },
    reducers:{
        recordInit(state,action){
            return {loginRecordData:action.loginRecord.loginRecordData};
        }
    }
}