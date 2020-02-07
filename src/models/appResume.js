import axios from "axios";
import { message } from 'antd';
function getFileList(userid){
    return axios.get(`/api/appendix/${userid}`).then(res=>{
        return {code:res.data.code,data:res.data.data}
    })
}
function delResumeFile(fileId) {
    return axios.delete(`/api/appendix/${fileId}`).then(res=>{
        return {code:res.data.code,msg:res.data.msg}
    });
}
function downloadFile(payload){
    return axios.post(`/api/downloadfile`,{data:payload.path}, {
        responseType:'blob'
    }).then(res=>{
        if(!!res.data){
            let url = window.URL.createObjectURL(new Blob([res.data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', payload.filename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link);
            return {code: 0}
        }
        return {code: -1}
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
                const { code, data } = yield call(getFileList, JSON.parse(window.localStorage.getItem('userinfo')).userid);
                if(code === 0){
                    yield put({ type: "setFileList", fileListData: data });
                }else{
                    message.error("文件列表获取失败");
                }
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
        },
        *downloadFileFn({ data },{call, put}) {
            try{
                const { code } = yield call(downloadFile,data);
                if(code !== 0){
                    message.error("获取文件失败");
                }
            }catch(err){
                message.error("获取文件失败");
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