export default {
    "post /api/appRegister" (req, res, next){
        const { registerUsername, registerPassword, invitation } = req.body;
        console.log(registerUsername, registerPassword, invitation);
        if(registerUsername === "zxy"){
            return res.json({
                code:-1,
                msg:'该用户已存在'
            })
        }else{
            return res.json({
                code:0,
                msg:'注册成功'
            })
        }
    }
}