export default {
    "post /api/appLogin"(req, res, next) {
      const { username, password } = req.body;
      console.log(username, password);
      if (username === "zxy" && password === "123") {
        return res.json({
          code: 0,
          data: {
            token: "istoken",
            role: "admin",
            username: "zxy"
          },
          msg:'ok'
        });
      }
      if(username !== "zxy"){
        return res.json({
          code: -1,
          msg: "该用户不存在"
        })
      }
      if(password !== "123"){
        return res.json({
          code: -2,
          msg: "密码错误"
        })
      }
      // return res.status(401).json({
      //   code: -1,
      //   msg: "密码错误"
      // });
    }
  };
  