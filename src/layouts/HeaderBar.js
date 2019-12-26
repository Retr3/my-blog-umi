import React from 'react';
import screenfull from 'screenfull'
import { connect } from 'dva';
import { Layout, Dropdown, Menu, Icon, Badge, Avatar } from 'antd';
const { Header } = Layout;

@connect(state=>({isLogin: !!state.appLogin.token}))
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
  screenfullToggle = () => {
    if (screenfull.enabled) {
      screenfull.toggle()
    }
  }
  render() {
    const {icon, count, avatar,src} = this.state;
    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
            2nd menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
            3rd menu item
          </a>
        </Menu.Item>
      </Menu>
    )
    const login = (
      <Dropdown overlay={menu}>
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
              <span onClick={() => this.setState({count: 0})}>
                <Badge count={count} overflowCount={99} style={{marginRight: -8}}>
                  <Icon type="bell" style={{fontSize:'22px'}} />
                </Badge>
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