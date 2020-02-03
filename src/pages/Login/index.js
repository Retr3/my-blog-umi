import React from 'react';
import LoginItem from './LoginItem'
import RegisterForm from './RegisterForm'
import LoginLoading from '../../components/Loading/LoginLoading'
import loadImgAsync from '../../utils/imageLoad'
import { connect } from 'dva';
@connect(state=>({isLogin: !!state.appLogin.userid}))
class AppLogin extends React.Component {
  state={
    showBox: 'login',   //展示当前表单
    url: new Date().getHours() > 6 && new Date().getHours() < 18 ?'http://127.0.0.1:7070/public/images/login-morning.jpg':'http://127.0.0.1:7070/public/images/login-night.jpg',  //背景图片
    loading:false,
  }
  componentDidMount(){
    this.initPage();
  }
  switchShowBox= box =>{
    this.setState({
      showBox:box
    })
  }
  initPage = () =>{
    this.setState({
      loading:true
    })
    loadImgAsync(this.state.url).then(url=>{
        this.setState({
          loading:false,
          url
        })
    }).catch(err=>{
      console.log('图片加载失败'+err);
    })
  }
  render() {
    const {showBox,loading} = this.state
    return (
        <div id="login-page">
          {
            loading ?<LoginLoading/>
            :
            <div>
              <div id='backgroundBox' className="backgroundBox" style={{ backgroundImage:`url(${this.state.url})`}}/>
              <div className='container'>
                <LoginItem className={showBox === 'login' ? 'box showBox' : 'box hiddenBox'}
                      redirpath={!!this.props.location.state?(this.props.location.state.redirect !=="login"?this.props.location.state.redirect:"/index"):"/index"}
                      switchShowBox={this.switchShowBox}></LoginItem>
                <RegisterForm className={showBox === 'register' ? 'box showBox' : 'box hiddenBox'}
                      switchShowBox={this.switchShowBox}></RegisterForm>
              </div>
            </div>
          }
        </div>
    );
  }
}


export default AppLogin