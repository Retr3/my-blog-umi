import axios from "axios";
import { message } from 'antd';

//查询文章列表/指定文章
function getArticleList(articleName){
    return axios.get("/api/article",{params:{articleName, userid: JSON.parse(window.localStorage.getItem('userinfo')).userid}}).then(res=>{
        return {articleList:res.data};
    });
}
//删除
function delArticle(articleId){
    return axios.delete(`/api/article/${articleId}`).then(res=>{
        return {code:res.data.code,msg:res.data.msg};
    });
}

export default {
    namespace:"appArticleList",
    state:{
        articleList:[]
    },
    effects:{
        //获取文章列表
        *getAppArticleListFn({ articleName },{call, put}){
            try{
                const { articleList } = yield call(getArticleList, articleName);
                yield put({ type: "setArticleList", articleList });
            }catch(err){
                message.error(`数据获取失败`);
            }
           
        },
        //删除
        *delArticleFn({ articleId, reloadFn },{call, put}){
            try{
                if(articleId){
                    const { code } = yield call(delArticle,articleId);
                    if(code === 0){
                        message.success("文章删除成功");
                        reloadFn('');
                    }else{
                        message.error("文章删除失败");
                    }
                }
            }catch(err){

            }
        }
    },
    reducers:{
        setArticleList(state,action){
            return {articleList:action.articleList};
        }
    }
}