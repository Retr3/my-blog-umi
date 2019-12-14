export default {
    //获取前台访客列表
    "get /api/getShowVisitorInfo"(req, res, next) {
        return res.json({
            data:[{
                key: '1',
                visit_time: '2019-01-01 12:00:00',
                location: '上海',
                ip: '192.168.0.12',
              },
              {
                key: '2',
                visit_time: '2019-01-01 12:00:00',
                location: '北京',
                ip: '192.168.0.13',
              },
              {
                key: '3',
                visit_time: '2019-01-01 12:00:00',
                location: '深圳',
                ip: '192.168.0.14',
              },{
                key: '4',
                visit_time: '2019-01-01 12:00:00',
                location: '上海',
                ip: '192.168.0.15',
              },{
                key: '5',
                visit_time: '2019-01-01 12:00:00',
                location: '上海',
                ip: '192.168.0.16',
              },{
                key: '6',
                visit_time: '2019-01-01 12:00:00',
                location: '上海',
                ip: '192.168.0.17',
              },{
                key: '7',
                visit_time: '2019-01-01 12:00:00',
                location: '上海',
                ip: '192.168.0.18',
              },{
                key: '8',
                visit_time: '2019-01-01 12:00:00',
                location: '上海',
                ip: '192.168.0.19',
              },{
                key: '9',
                visit_time: '2019-01-01 12:00:00',
                location: '上海',
                ip: '192.168.0.2',
              },{
                key: '10',
                visit_time: '2019-01-01 12:00:00',
                location: '上海',
                ip: '192.168.0.3',
              },{
                key: '11',
                visit_time: '2019-01-01 12:00:00',
                location: '上海',
                ip: '192.168.0.4',
              },{
                key: '12',
                visit_time: '2019-01-01 12:00:00',
                location: '上海',
                ip: '192.168.0.5',
              }]
        })
    },
    //获取后台登录列表
    "get /api/getLoginVisitorInfo"(req, res, next){
        return res.json({
        data:[{
            key: '1',
            name:'rick',
            visit_time: '2019-01-01 12:00:00',
            location: '上海',
            ip: '192.168.0.1',
            },
            {
            key: '2',
            name:'rick',
            visit_time: '2019-01-01 12:00:00',
            location: '上海',
            ip: '192.168.0.2',
            },
            {
            key: '3',
            name:'rick',
            visit_time: '2019-01-01 12:00:00',
            location: '上海',
            ip: '192.168.0.3',
            },{
            key: '4',
            name:'rick',
            visit_time: '2019-01-01 12:00:00',
            location: '上海',
            ip: '192.168.0.4',
            },{
            key: '5',
            name:'rick',
            visit_time: '2019-01-01 12:00:00',
            location: '上海',
            ip: '192.168.0.5',
            },
            {
            key: '6',
            name:'rick',
            visit_time: '2019-01-01 12:00:00',
            location: '上海',
            ip: '192.168.0.6',
            },
            {
            key: '7',
            name:'rick',
            visit_time: '2019-01-01 12:00:00',
            location: '上海',
            ip: '192.168.0.7',
            },{
            key: '8',
            name:'rick',
            visit_time: '2019-01-01 12:00:00',
            location: '上海',
            ip: '192.168.0.8',
            },{
            key: '9',
            name:'rick',
            visit_time: '2019-01-01 12:00:00',
            location: '上海',
            ip: '192.168.0.9',
            },
            {
            key: '10',
            name:'rick',
            visit_time: '2019-01-01 12:00:00',
            location: '上海',
            ip: '192.168.0.11',
            },
            {
            key: '11',
            name:'rick',
            visit_time: '2019-01-01 12:00:00',
            location: '上海',
            ip: '192.168.0.21',
            },{
            key: '12',
            name:'rick',
            visit_time: '2019-01-01 12:00:00',
            location: '上海',
            ip: '192.168.0.31',
            }]
        });
        
    },
    //获取访客静态数据
    "get /api/getVisitorStaticInfo"(req, res, next){
      return res.json({
        data:{
          todayVisitor:10,
          weekVisitor:30,
          totalVisitor:400
        }
      })
    }
}