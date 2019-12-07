export default {
     /**
     * 附件简历列表
     */
    "get /api/resumeFileList"(req, res, next) {
        return res.json({
            data:{
                fileListData:[{
                    id:'1',
                    fileName:"文件1",
                    uploadTime:'2019-12-01',
                    fileSize:'2m',
                    remarks:'备注',
                    uploadUser:'rick',
                    downloadUrl:''
                  },{
                    id:'2',
                    fileName:"文件2",
                    uploadTime:'2019-12-01',
                    fileSize:'2m',
                    remarks:'备注',
                    uploadUser:'rick',
                    downloadUrl:''
                  },{
                    id:'3',
                    fileName:"文件3",
                    uploadTime:'2019-12-01',
                    fileSize:'2m',
                    remarks:'备注',
                    uploadUser:'rick',
                    downloadUrl:''
                  }]
            }
        })
    },
    /**
     * 附件简历删除
     */
    "post /api/delResumeFile"(req, res, next) {
        const { fileId } = req.body;
        if(fileId === "1"){
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
    },
    /**
     * 简历信息查询
     */
    "get /api/getResumeInfo"(req, res, next) {
        return res.json({
            data:{
                resumeInfo:{
                    resumename:'张',
                    sex:"1",
                    age:'2010-01',
                    email:'123@qq.com',
                    colleges:'XXX大学',
                    position:'工程师',
                    cityname:'北京',
                    entryTime:'2',
                    worktime:'2016-06',
                    jobintention:'求职意向',
                    hobby:'爱好',
                    selfdescription:'自我评价',
                    skills:['技能1','技能2'],//技能
                    slider:[10,81],//技能熟练度
                    experience:['经历1','经历2'],//经历列表
                    experiencetime:['2019-01','2019-02']//经历时间

                }
            }
        }); 
    },
    /**
     * 简历修改
     */
    "post /api/setResumeInfo"(req, res, next){
        const { formData } = req.body;
        console.log(formData);
        if(formData.resumename){
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
    }
}