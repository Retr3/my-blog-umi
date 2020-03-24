import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import Link from "umi/link";
import styles from './SiderNav.css';
import logo from '../assets/images/logo.png'
const { Sider } = Layout;
  //menu方法
const menus = [
  { title: '首页',
    icon: 'home',
    key: '/home'
  },
  {
    title: '文章管理',
    icon: 'switcher',
    key: '/article'
  },
  {
    title: '访客管理',
    icon: 'team',
    key: '/visitor'
  },
  {
    title: '简历管理',
    icon: 'profile',
    key: '/resume',
    subs: [
      {title:'在线简历',icon:'',key:'/resume/online'},
      {title:'附件简历上传',icon:'',key:'/resume/upload'}
    ]
  },
  {
    title:'画廊',
    icon: 'picture',
    key: '/gallery'
  },
  {
    title:'个人中心',
    icon: 'user',
    key: '/personal'
  }
];

class SiderNav extends React.Component{
  state={
    openKeys:[],
    isOpenKey:[]
  }
  componentDidMount(){
    //调用父组件onref,把当前子组件this保存在this.child中
    this.props.onRef(this);
    const pathname = this.props.selectKeys[0];
    const rank = pathname.split('/');
    switch (rank.length) {
      case 2 : 
        break;
      case 4 : //三级目录，要展开两个subMenu
        this.setState({
          openKeys: [rank.slice(0, 2).join('/'), rank.slice(0, 3).join('/')]
        })
        break;
      default :
        this.setState({
          openKeys: [pathname.substr(0, pathname.lastIndexOf('/'))]
        })
    }
  }
  renderMenuItem=({title,icon,key})=>{
    return    <Menu.Item key={key}>
                <Link to={key}>
                  {icon && <Icon type={icon}/>}
                  <span>{title}</span>
                </Link>
              </Menu.Item>
  }
  renderSubMenu=({title,icon,key,subs})=>{
    return  <Menu.SubMenu key={key} 
                title={<span>{icon && <Icon type={icon}/>}<span>{title}</span></span>}>
                {
                  subs && subs.map(subitem=>{
                    return subitem.subs && subitem.subs.length>0?this.renderSubMenu(subitem):this.renderMenuItem(subitem)
                  })
                }
            </Menu.SubMenu>
  }

  onOpenChange = (openKeys) => {
    //此函数的作用只展开当前父级菜单（父级菜单下可能还有子菜单）
    if (openKeys.length === 0 || openKeys.length === 1) {
      this.setState({
        openKeys
      })
      return
    }
    //最新展开的菜单
    const latestOpenKey = openKeys[openKeys.length - 1]
    //判断最新展开的菜单是不是父级菜单，若是父级菜单就只展开一个，不是父级菜单就展开父级菜单和当前子菜单
    //只适用于3级菜单
    if (latestOpenKey.includes(openKeys[0])) {
      this.setState({
        openKeys
      })
    } else {
      this.setState({
        openKeys: [latestOpenKey]
      })
    }
  }
  onCollapse = () =>{
    let openKeys = this.state.openKeys;
    let isOpenKey = this.state.isOpenKey;
    [openKeys,isOpenKey]=[isOpenKey,openKeys]
    this.setState({
      openKeys,
      isOpenKey
    })
  }
  render() {
    const {collapsed,selectKeys} = this.props;
    return (
      <Sider style={{minHeight:'100vh',overflow:'auto'}} trigger={null}  collapsible collapsed={collapsed}>
          <div className={styles['logodom']}>
            <a href="/">
              <img src={logo} alt="log" className={styles['logo']}/>
              <h1 className={styles["sys-title"]}>Blog &nbsp; Management</h1>
            </a>

          </div>
          <Menu theme="dark" mode="inline"  onOpenChange={this.onOpenChange} openKeys={this.state.openKeys} selectedKeys={selectKeys}>
            {menus.map(item=>{
              return  item.subs && item.subs.length>0?this.renderSubMenu(item):this.renderMenuItem(item)
            })}
          </Menu>
      </Sider>
    );
  }
}
export default SiderNav
