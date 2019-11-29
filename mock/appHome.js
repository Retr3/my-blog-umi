export default {
    "get /api/appHomeStaticInfo"(req, res, next) {
        return res.json({
            data:{
                arch:"x64",//架构
                type:"Windows",//平台
                release:"6.1",// 系统发行版本
                totalmem:"8g",//总内存
                cpusmodel:'3.1GHz',//cpu频率
                cpuslength:'4',//cpu核心数
            }
        })
    },
    "get /api/appHomeInfo"(req, res, next){
        return res.json({
            data:{
                uptime:"3",//系统运行时间
                useMem:"6",//内存使用
                MemRate:60,//内存使用率
                freemem:"4",//内存空闲
                cpuLoad:'20',//cpu负载
                loadavg:""//平均负载
            }
        })
    }
}