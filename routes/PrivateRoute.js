import Redirect from "umi/redirect";
import { connect } from 'dva';
export default connect(state=>({isLogin: !!state.appLogin.token}))(props => {
  if (!props.isLogin) {
    return <Redirect to={{
      pathname:'/login',
      state:{redirect:props.location.pathname}
    }} />;
  }
  return (
    <div>
      {props.children}
    </div>
  );
});
