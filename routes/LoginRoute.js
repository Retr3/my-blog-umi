import Redirect from "umi/redirect";
import { connect } from 'dva';
export default connect(state=>({isLogin: !!state.appLogin.token}))(props => {
    //登录页守卫，在存在登录态的情况下访问登录页跳转至首页
    //(也可以创建一个公共store在进入每页时将store赋值为当前路径，这样访问登录页时会回跳当前页)
    if (props.isLogin) {
            return <Redirect to={{
                pathname:'/index'
            }} />;
    }
    return (
        <div>
        {props.children}
        </div>
    );
});
