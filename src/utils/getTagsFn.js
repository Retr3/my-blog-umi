import axios from "axios";
//根据idlist获取对应标签
export default function getTags(idList){
    return axios.get(`/api/articletags`,{
      params:{idList}
    }).then(res=>{
      return res.data;
    })
  }