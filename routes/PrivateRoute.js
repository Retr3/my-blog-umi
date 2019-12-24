import Redirect from "umi/redirect";
import { connect } from 'dva';
import LoadableComponent from './Loadable'

export default connect(state=>({isLogin: !!state.appLogin.token}))(props => {
  if (!props.isLogin) {
    return <Redirect to={{
      pathname:'/login',
      state:{redirect:props.location.pathname}
    }} />;
  }
  // const ChidrenComponent = ()=>{
  //     return <div>
  //         {props.children}
  //       </div>
  // }
  // return (
  //   LoadableComponent(<ChidrenComponent/>)
  // );
  return <div>
           {props.children}
         </div>
});
