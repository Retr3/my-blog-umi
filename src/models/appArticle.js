import axios from "axios";
import { message } from 'antd';
//获取指定文章
function getArticleInfo(articleId){
    return axios.get(`/api/article/${articleId}`).then(res=>{
        return {articleData:res.data};
    });
}
//修改
function updateArticleInfo(articleData){
    return axios.put(`/api/article/${articleData.id}`,{...articleData}).then(res=>{
       return {code:res.data.code,msg:res.data.msg} 
    })
}
//添加
function addArticleInfo(articleData){
    return axios.post('/api/article',{...articleData}).then(res=>{
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
        *addOrUdpateArticleFn({ articleData,toggleFn, reloadFn },{call, put}){
            try{
               // console.log(articleData);
                let code, msg;
                //true修改/false添加
                if(!!articleData.id){
                    const result = yield call(updateArticleInfo,articleData);
                    code = result.code;
                    msg = result.msg;
                }else{
                    articleData.userid = JSON.parse(window.localStorage.getItem('userinfo')).userid;
                    const result = yield call(addArticleInfo,articleData);
                    code = result.code;
                    msg = result.msg;
                }
                if(code === 0){
                    message.success(msg);
                    yield put({ type: "resetArticleInfo"});
                    yield reloadFn('');
                    setTimeout(()=>{
                        toggleFn('');
                    },500)
                    
                }else{
                    message.error(msg);
                }
            }catch(err){
                message.error('创建失败 500');
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
