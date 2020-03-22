import axios from "axios";
//获取定位方法
const key = 'D2YBZ-6ZZ6X-S724L-73AS3-7UFKH-5HBG4';
export default function getLocation(){
  const url = process.env.NODE_ENV==='development'?'/ip':'https://bird.ioliu.cn/ip';
  return axios.get(url,{
    baseURL:'',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }).then(res=>{
    if(res.data.status.code === 200){
      return res.data.data.ip;
    }else{
      return null;
    }
  })
}