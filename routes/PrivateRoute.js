import Redirect from "umi/redirect";
import { connect } from 'dva';

export default connect(state=>({isLogin: !!state.appLogin.userid}),{
  setBreadCrumbFn: path => ({
    type: "appBreadcrumb/setCrumbListFn",path
  })
})(props => {
  if (!props.isLogin || !JSON.parse(localStorage.getItem('userinfo'))) {
    return <Redirect to={{
      pathname:'/login',
      state:{redirect:props.location.pathname}
    }} />;
  }
  if(!(props.location.pathname === '/login' || props.location.pathname === '/')){
    props.setBreadCrumbFn(props.location.pathname);
  }
  return <div>
           {props.children}
         </div>
});
