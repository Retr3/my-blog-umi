//文章标签接口
let tagsInfo = ['标签1','标签2'];
export default {
    //获取标签信息
    "get /api/getTagsInfo"(req, res, next) {
        return res.json({
            data:tagsInfo
        })
    },
    //更新标签信息
    "post /api/updateTagsInfo"(req, res, next) {
        const { tags } = req.body;
        console.log(tags);
        //查询数据库返回结果
        tagsInfo = tags;
        //模拟返回状态
        let restatus = Math.random()*10;
        if(restatus>6){
            return res.json({
                code: 0
            });
        }else{
            return res.json({
                code: -1
            });
        }
    }

}