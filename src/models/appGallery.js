import axios from "axios";
import { message } from 'antd';
//获取图片列表
function getGallery(){
    return axios.get(`/api/gallery/${JSON.parse(window.localStorage.getItem('userinfo')).userid}`).then(res=>{
        return {data:res.data};
    });
}
//删除图片
function delGallery(id){
    return axios.delete(`/api/gallery/${id}`).then(res=>{
        return {code:res.data.code, msg: res.data.msg};
    });
}
export default {
    namespace:"appGallery",
    state:{
        galleryInfo:[]
    },
    effects:{
        //获取前台访客记录
        *getGalleryInfoFn(obj,{call,put}){
            try{
                const { data } = yield call(getGallery);
                // const styleList = [{style:'itemOneCol',size:'1x1'},
                // {style:'itemOneCol',size:'1x2'},
                // {style:'itemTwoCol',size:'1x1'}]
                if(!!data){
                    const newData = data.map(item=>{
                        const style = (item.style ==='one')?'itemOneCol':'itemTwoCol';
                        const size = (item.size ==='1x1')?'1x1':'1x2';
                        return {id:item.id, groups:item.type.split(','), src: 'https://api.mimiron.cn'+item.imagepath,size,style}
                    })
                    console.log(newData)
                    yield put({ type: "setGalleryInfo",newData});
                }
            }catch(err){
                console.log(err);
                message.error('数据获取失败');
            }
        },
        *delGalleryFn({id,reloadFn},{call}){
            try{
                const { code, msg } = yield call(delGallery,id);
                if(code === 0){
                    message.success(msg);
                    reloadFn();
                }else{
                    message.error(msg);
                }
            }catch(err){
                console.log(err);
                message.error('删除失败 500');
            }
        }
    },
    reducers:{
        setGalleryInfo(state,action){
            return {galleryInfo:action.newData}
        }
    }
}