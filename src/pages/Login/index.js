import React from 'react';
import LoginItem from './LoginItem'
import RegisterForm from './RegisterForm'
import { connect } from 'dva';

@connect(state=>({isLogin: !!state.appLogin.token}))
class AppLogin extends React.Component {
  state={
    showBox: 'login',   //展示当前表单
    url: '',  //背景图片
    loading:false,
  }
  componentDidMount(){
    console.log(this.props.location.state);
  }
  switchShowBox= box =>{
    this.setState({
      showBox:box
    })
  }
  render() {
    const {showBox,loading} = this.state
    return (
        <div id="login-page">
          <div id='backgroundBox' className="backgroundBox"/>
          <div className='container'>
            <LoginItem className={showBox === 'login' ? 'box showBox' : 'box hiddenBox'}
                  redirpath={!!this.props.location.state?(this.props.location.state.redirect !=="login"?this.props.location.state.redirect:"/index"):"/index"}
                  switchShowBox={this.switchShowBox}></LoginItem>
            <RegisterForm className={showBox === 'register' ? 'box showBox' : 'box hiddenBox'}
                  switchShowBox={this.switchShowBox}></RegisterForm>
          </div>
        </div>
    );
  }
}


export default AppLogin