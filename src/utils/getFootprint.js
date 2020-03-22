import axios from 'axios'
const getFootprint = async (ip) =>{
    // 获取ip定位
    return axios.get('/api/footprint',{params:{ip}}).then(res=>{
      if(res.data && res.data.code === 0){
        return res.data.location;
      }else{
        return null;
      }
    })
}
export default getFootprint;