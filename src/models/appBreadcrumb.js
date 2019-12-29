
export default {
    namespace:"appBreadcrumb",
    state:{
        crumbList:[]
    },
    effects:{
        *setCrumbListFn({path},{call, put}){
            try{
                let pathList = path.split('/').slice(1);
                yield put({ type: "setCrumbList", crumbList: pathList });
            }catch(err){

            }
        }
    },
    reducers: {
        setCrumbList(state, action) {
            return {crumbList:action.crumbList}
        },
    }
}