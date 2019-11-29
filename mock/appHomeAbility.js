export default {
    "get /api/appHomeAbility"(req, res, next) {
        return res.json({
            data:{
                chartData:[{
                    day: "星期一",
                    type: "内存使用率",
                    percentage: 10
                  },{
                    day: "星期二",
                    type: "内存使用率",
                    percentage: 20
                  },{
                    day: "星期三",
                    type: "内存使用率",
                    percentage: 30
                  },{
                    day: "星期四",
                    type: "内存使用率",
                    percentage: 30
                  },{
                    day: "星期五",
                    type: "内存使用率",
                    percentage: 15
                  },{
                    day: "星期六",
                    type: "内存使用率",
                    percentage: 10
                  },{
                    day: "星期日",
                    type: "内存使用率",
                    percentage: 10
                  },{
                    day: "星期一",
                    type: "CPU使用率",
                    percentage: 70
                  },{
                    day: "星期二",
                    type: "CPU使用率",
                    percentage: 60
                  },{
                    day: "星期三",
                    type: "CPU使用率",
                    percentage: 45
                  },{
                    day: "星期四",
                    type: "CPU使用率",
                    percentage: 50
                  },{
                    day: "星期五",
                    type: "CPU使用率",
                    percentage: 50
                  },{
                    day: "星期六",
                    type: "CPU使用率",
                    percentage: 40
                  },{
                    day: "星期日",
                    type: "CPU使用率",
                    percentage: 30
                  }]
            }
        })
    }
}