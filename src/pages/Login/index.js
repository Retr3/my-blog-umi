import React from 'react';
import LoginItem from './LoginItem'
import RegisterForm from './RegisterForm'
import LoginLoading from '../../components/Loading/LoginLoading'
import { connect } from 'dva';
@connect(state=>({isLogin: !!state.appLogin.token}))
class AppLogin extends React.Component {
  state={
    showBox: 'login',   //展示当前表单
    url: 'http://h1.ioliu.cn/bing/ReindeerNorway_ZH-CN5913190372_1920x1080.jpg',  //背景图片
    loading:false,
  }
  componentDidMount(){
    console.log(this.props.location.state);
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
    this.loadImgAsync(this.state.url).then(url=>{
        this.setState({
          loading:false,
          url
        })
    }).catch(err=>{
      console.log('图片加载失败'+err);
    })
  }
  loadImgAsync = url=>{
    return new Promise((resolve,reject)=>{
      const image = new Image();
      image.onload = () => {resolve(url)};
      image.onerror = () => {reject()};
      image.src = url;
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