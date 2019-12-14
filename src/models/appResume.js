import axios from "axios";
import { message } from 'antd';
function getFileList(){
    return axios.get("/api/resumeFileList").then(res=>{
        return {data:res.data.data}
    })
}
function delResumeFile(fileId) {
    return axios.post("/api/delResumeFile", {fileId}).then(res=>{
        return {code:res.data.code,msg:res.data.msg}
    });
}
export default {
    namespace:"appResume",
    state:{
        fileListData:[]
    },
    effects:{
        *getFileListFn(obj,{call, put}){
            try{
                const { data } = yield call(getFileList);
                yield put({ type: "setFileList", fileListData: data.fileListData });
            }catch(err){
                message.error("文件列表获取失败");
                console.log(err);
            }
        },
        *deleteFileFn({ fileId },{call, put}){
            try{
                const { code,msg } = yield call(delResumeFile,fileId);
                if(code === 0){
                    message.success("文件删除成功");
                    yield put({type:"getFileListFn"})
                }else{
                    message.error(msg);
                }
            }catch(err){
                console.log(err);
            }
        }
    },
    reducers:{
        setFileList(state,action){
            return {fileListData:action.fileListData};
        }
    }
}