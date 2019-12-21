// let ipdata=['192.168.0.1','192.168.0.2','192.168.0.3','192.168.0.4','192.168.0.5']
let ipdata=[{
    id:'1',
    ip:'192.168.0.1',
    location:'上海'
},{
    id:'2',
    ip:'192.168.0.2',
    location:'上海'
},{
    id:'3',
    ip:'192.168.0.3',
    location:'深圳'
},{
    id:'4',
    ip:'192.168.0.4',
    location:'上海'
},{
    id:'5',
    ip:'192.168.0.5',
    location:'深圳'
}]
export default {
    //获取黑名单列表
    "get /api/getBlackList"(req, res, next) {
        return res.json({
            data:ipdata
        })
    },
    //添加黑名单
    "post /api/addBlackListInfo"(req, res, next){
        const { ip,location } = req.body;
        console.log(ip,location);
        let id = new Date().getTime();
        if(ip){
             ipdata = [...ipdata,{ip,location,id}];
             //模拟成功
             return res.json({
                code: 0,
                msg:'ok'
              });
        }else{
            //模拟失败
            return res.json({
                code:-1,
                msg:"error"
            })
        }
    },
    //删除黑名单
    "post /api/delBlackListInfo"(req, res, next){
        const { ip } = req.body;
        if(ip){
            ipdata = ipdata.filter(item=>item.ip !== ip);
            //模拟成功
            return res.json({
                code: 0,
                msg:'ok'
              });
        }else{
            //模拟失败
            return res.json({
                code:-1,
                msg:"删除失败"
            })
        }
    }
}