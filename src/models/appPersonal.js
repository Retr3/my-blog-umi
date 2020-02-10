import axios from "axios";
import { message } from 'antd';
function updatePersonalInfo(payload){
    return axios.put(`/api/subscriber/${payload.userid}`,payload.userinfo).then(res=>{
        return {code: res.data.code, msg: res.data.msg};
    });
}
export default {
    namespace:'appPersonal',
    state:{
        isSuccess: false,
        avatarPath: ''
    },
    effects:{
        *updatePersonalInfoFn({ payload },{call,put}){
            try{
                const { code } = yield call(updatePersonalInfo, payload);
                if(code === 0){
                    let userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
                    userinfo.nickname = payload.userinfo.nickname;
                    userinfo.sign = payload.userinfo.sign;
                    userinfo.occupation = payload.userinfo.occupation;
                    userinfo.company = payload.userinfo.company;
                    userinfo.location = payload.userinfo.location;
                    userinfo.team = payload.userinfo.team;
                    localStorage.setItem("userinfo", JSON.stringify(userinfo));
                    yield put({ type: "isSuccessFn",flag: true});
                    message.success("信息修改成功");
                }else{
                    message.error(`信息修改失败`);
                    yield put({ type: "isSuccessFn",flag: false});
                }
            }catch(err){
                message.error(`信息修改失败`);
                yield put({ type: "isSuccessFn",flag: false});
            }
        },
        *setAvatarFn({id, path },{call,put}){
            try{
                let userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
                const { code } = yield call(updatePersonalInfo, { userid:userinfo.userid, userinfo:{avatar_id: id} });
                if(code === 0){
                    userinfo.imagepath = path;
                    userinfo.avatar_id = id;
                    localStorage.setItem("userinfo", JSON.stringify(userinfo));
                    message.success("头像上传成功");
                }else{
                    message.error('头像上传失败');
                }
            }catch(err){
                console.log(err);
                message.error('头像上传失败');
            }
        }
    },
    reducers: {
        isSuccessFn(state, action) {
          return {isSuccess: action.flag};
        }
    }
}