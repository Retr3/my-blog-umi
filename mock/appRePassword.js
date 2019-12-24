export default {
    "post /api/appRePassword"(req, res, next) {
        console.log(req.body);
        const { oldpassword, newpassword } = req.body.payload;
        console.log(oldpassword, newpassword);
        if (oldpassword === "123") {
          return res.json({
            code: 0,
            msg:'ok'
          });
        }else{
            return res.json({
                code: -1,
                msg: "旧密码错误"
            })
        }
      }
}