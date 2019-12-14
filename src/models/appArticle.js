import axios from "axios";
import { message } from 'antd';
//获取指定文章
function getArticleInfo(articleId){
    return axios.post("/api/getArticleInfo", {articleId}).then(res=>{
        return {articleData:res.data.data};
    });
}
//修改或添加
function addOrUpdateArticleInfo(articleData){
    return axios.post('/api/addOrUpdateArticle',{articleData}).then(res=>{
       return {code:res.data.code,msg:res.data.msg} 
    })
}

export default {
    namespace:"appArticle",
    state:{
        articleInfo:{}
    },
    effects:{
        //获取指定文章信息
        *getArticleInfoFn({ articleId },{call, put}){
            try{
                const { articleData } = yield call(getArticleInfo,articleId);
                yield put({ type: "setArticleInfo", articleData });
            }catch(err){
                console.log(err);
            }
        },
        //添加或修改
        *addOrUdpateArticleFn({ articleData,reloadFn },{call, put}){
            try{
                console.log(articleData);
                const { code, msg } = yield call(addOrUpdateArticleInfo,articleData);
                if(code === 0){
                    message.success(`文章${msg}成功`);
                    yield put({ type: "resetArticleInfo"});
                    setTimeout(()=>{
                        reloadFn('');
                    },500)
                    
                }else{
                    message.error(`文章${msg}失败`);
                }
            }catch(err){
                message.error(`内部错误`);
                console.log(err);
            }
        }
        
    },
    reducers:{
        setArticleInfo(state,action){
            return {articleInfo:action.articleData};
        },
        resetArticleInfo(){
            return {articleInfo:{}}
        }
    }
}
