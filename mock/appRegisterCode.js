//注册码
export default {
    "get /api/getRegisterCode"(req, res, next) {
        //模拟生成注册码
        let num =[0,1,2,3,4,5,6,7,8,9,10];
        let letter = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        let flag = true;
        let codeStr ='';
        for(let i=0;i<8;i++){
            let randoms1 = parseInt(Math.random()*10);
            let randoms2 = parseInt(Math.random()*10);
            let num1 = num[randoms1];
            let num2 = num[randoms2];
            let numtotal = parseInt(num1+num2);
            let code ='';
            if(flag){
                code = letter[numtotal];
            }else{
                code = numtotal;
            }
            if(i%3 ===0){
                flag = false;
            }else{
                flag = true;
            }
            codeStr = codeStr+code;
        }
        console.log(codeStr);
        return res.json({
            codeStr
        })
    },
}