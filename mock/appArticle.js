export default {
    //update获取指定文章信息
    "post /api/getArticleInfo"(req, res, next) {
        //获取文章id
        const { articleId } = req.body;
        console.log(articleId);
        //查询数据库返回结果
        return res.json({
            data:{
                id:'1',
                article_title:'标题一',
                article_tags:['标签1','标签2'],
                img_name:'文章封面.png',
                img_path:'http://h1.ioliu.cn//bing/QueenVictoriaAgave_ZH-CN0113999146_1920x1080.jpg',
                braft_row:{
                    blocks: [{data: {},
                        depth: 0,
                        entityRanges: [],
                        inlineStyleRanges: [{offset: 0, length: 3, style: "STRIKETHROUGH"}],
                        key: "ha4n",
                        text: "阿萨德",
                        type: "unstyled"}],
                    entityMap: {}
                },
                braft_html:`</div><p><span style="text-decoration:line-through">阿萨德</span></p>`

            }
        })
    },
    //查询文章列表
    "get /api/getArticleList"(req, res, next) {
        return res.json({
            data:[{
                id:'1',
                article_title:'标题一',
                cover_path:'http://h1.ioliu.cn//bing/QueenVictoriaAgave_ZH-CN0113999146_1920x1080.jpg',
                article_user:'rick',
                create_time:'2019-12-10',
                update_time:'2019-12-10',
                tags:['标签1','标签2']
            },{
                id:'2',
                article_title:'标题二',
                cover_path:'http://h1.ioliu.cn/bing/MarrakechMarket_ZH-CN5880133555_1920x1080.jpg',
                article_user:'rick',
                create_time:'2019-12-10',
                update_time:'2019-12-10',
                tags:['标签1','标签2']
            },{
                id:'3',
                article_title:'标题三',
                cover_path:'http://h1.ioliu.cn/bing/SheepCoteClod_ZH-CN7630556554_1920x1080.jpg',
                article_user:'rick',
                create_time:'2019-12-10',
                update_time:'2019-12-10',
                tags:['标签1','标签2']
            },{
                id:'4',
                article_title:'标题四',
                cover_path:'http://h1.ioliu.cn//bing/TengbocheMonastery_ZH-CN7555740661_1920x1080.jpg',
                article_user:'rick',
                create_time:'2019-12-10',
                update_time:'2019-12-10',
                tags:['标签1','标签2']
            },{
                id:'5',
                article_title:'标题五',
                cover_path:'http://h1.ioliu.cn//bing/Seidenschwanz_ZH-CN7486965726_1920x1080.jpg',
                article_user:'rick',
                create_time:'2019-12-10',
                update_time:'2019-12-10',
                tags:['标签1','标签2']
            }]
        })
    },
    //addorupdate
    "post /api/addOrUpdateArticle"(req, res, next) {
        const { articleData } = req.body;
        let msg = articleData.id?'更新':'添加';
        console.log(articleData.id);//添加没有id,更新有
        console.log(articleData.article_title);
        console.log(articleData.img_name);
        console.log(articleData.img_path);//封面路径
        console.log(articleData.article_tags);
        console.log(articleData.braft_row);
        console.log(articleData.braft_html);
        return res.json({
            code: 0,
            msg
        })
    },
    //delete
    "post /api/delArticle"(req, res, next) {
        const { articleId } = req.body;
        console.log(articleId);
        if(articleId === "1"){
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
