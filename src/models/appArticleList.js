import axios from "axios";
import { message } from 'antd';

//查询文章列表

function getArticleList(){
    return axios.get("/api/getArticleList").then(res=>{
        return {articleList:res.data.data};
    });
}
//删除
function delArticle(articleId){
    return axios.post("/api/delArticle", {articleId}).then(res=>{
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
        *getAppArticleListFn(obj,{call, put}){
            try{
                const { articleList } = yield call(getArticleList);
                yield put({ type: "setArticleList", articleList });
            }catch(err){
                message.error(`数据获取失败`);
            }
           
        },
        //删除
        *delArticleFn({ articleId },{call, put}){
            try{
                if(articleId){
                    const { code } = yield call(delArticle,articleId);
                    if(code === 0){
                        message.success("文章删除成功");
                        yield put({type:"getAppArticleListFn"})
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