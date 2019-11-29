export default {
    "get /api/appHomeRecord"(req, res, next) {
        return res.json({
            data:{
              loginRecordData:[{
                    title:'系统上次登录时间',
                    value:'2018-01-01'
                  },{
                    title:'系统上次登录用户',
                    value:'rick'
                  },{
                    title:'系统上次登录地点',
                    value:'上海'
                  }]
            }
        })
    }
}