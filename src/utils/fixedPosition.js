import axios from "axios";
//获取定位方法
const key = 'D2YBZ-6ZZ6X-S724L-73AS3-7UFKH-5HBG4';
export default function getLocation(ip){
    const params = {key};
    if(!!ip){
        params.ip = ip;
    }
    return axios.get(`/ws/location/v1/ip`,{
      params,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(res=>{
      if(res.data.status === 0){
        return res.data.result;
      }else{
        return null;
      }
    })
  }