import React from 'react';
import screenfull from 'screenfull'
import { connect } from 'dva';
import { Layout, Dropdown, Menu, Icon, Badge, Avatar,List } from 'antd';
const { Header } = Layout;
const noticeData = [{
  icon:'icon-email',
  title:'通知一:你好我是谁谁谁',
  description:'2小时前'
},{
  icon:'icon-email',
  title:'上次登录时间是2019-12-01',
  description:'2小时前'
},{
  icon:'icon-email',
  title:'通知三',
  description:'2小时前'
},]
@connect(state=>({isLogin: !!state.appLogin.token}),{
  getLogoutFn: () => ({
    type: "appLogin/logoutFn"
  })
})
class HeaderBar extends React.Component {
  state = {
    icon: 'fullscreen',
    count: 100,
    avatar: '',
    src:''
  }
  componentDidMount () {
    screenfull.onchange(() => {
      this.setState({
        icon: screenfull.isFullscreen ? 'fullscreen-exit' : 'fullscreen'
      })
    })
  }
  componentWillUnmount () {
    screenfull.off('change')
  }
  screenfullToggle = () =>{
    console.log(screenfull);
    if (screenfull.isEnabled) {
      screenfull.toggle()
    }
  }
  logout = e =>{
    e.preventDefault();
    this.props.getLogoutFn()
  }
  clearNotice = e =>{
    e.preventDefault();
    this.setState({count: 0})
  }
  render() {
    const {icon, count, avatar,src} = this.state;
    //用户下拉
    const userMenu = (
        <Menu>
          <Menu.Item key="0">
            <a href="/personal">
              <Icon type="user" className="headdropdown" /><span className="headdropdown" >个人中心</span>
            </a>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="1">
            <a href="/" onClick={e=>this.logout(e)}>
              <Icon type="logout" style={{marginRight: '0px'}} className="headdropdown" /><span className="headdropdown" >退出登录</span>
            </a>
          </Menu.Item>
        </Menu>
    )
    //通知下拉
    const notificationMenu = (
      <Menu>
        <div>
          <List
              itemLayout="horizontal"
              dataSource={noticeData}
              renderItem={(item,index) => (
                <List.Item style={{padding:'12px 24px'}} className="headNoticeList" key={"notice"+index}>
                  <List.Item.Meta
                    avatar={<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>}
                    title={<span>{item.title}</span>}
                    description={item.description}/>
                </List.Item>
              )}
            />
        </div>
          <Menu.Divider />
            <div className="headNoticeAction">
              <div onClick={e=>this.clearNotice(e)}>
                <i className='iconfont icon-clear' /><span>清理所有</span>
              </div>
              <div>
              <Icon type="more"/>
                <span>显示更多</span>
              </div>
            </div>
        </Menu>
    )
    const login = (
      <Dropdown overlay={userMenu}>
        {src?<Avatar src={avatar} />:<Avatar style={{ backgroundColor: '#87d068' }} icon="user" />}
      </Dropdown>)
    const nologin = (
      <Avatar size={64} icon="user"/>
    )
    return (
      <Header style={{background: '#fff', padding: '0 16px'}}>
          <Icon
            className="trigger"
            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.props.toggle}
          />
          <div style={{lineHeight: '64px', float: 'right'}}>
            <div className='header-ul'>
              <span><Icon type={icon} onClick={this.screenfullToggle}/></span>
              <span>
                <Dropdown overlay={notificationMenu}>
                  <Badge count={count} overflowCount={99} style={{marginRight: -8}}>
                    <Icon type="bell" style={{fontSize:'22px'}} />
                  </Badge>
                </Dropdown>
              </span>
              <span>
              {(!!this.props.isLogin && JSON.parse(localStorage.getItem('userinfo')))? login : nologin}
              </span>
            </div>
        </div>
      </Header>
    )
  }
}
export default HeaderBar