import { Breadcrumb,Icon } from 'antd'
import Link from "umi/link";
import { connect } from 'dva';
import breadcrumbMap from '../utils/BreadcrumbMap';

export default connect(state=>({
  crumbList:state.appBreadcrumb.crumbList
}))(function({crumbList}){
    return <Breadcrumb style={{lineHeight: '64px', height:'100%'}}>
    <Breadcrumb.Item><Link to='/home'><Icon type="home" theme="filled" /></Link></Breadcrumb.Item>
    {crumbList && crumbList.map(item=>{
      if ((typeof item) === 'object'){
        return <Breadcrumb.Item key={item.title}><Link to={item.to}>{item.title}</Link></Breadcrumb.Item>
      } else {
        return item === 'home'?'':<Breadcrumb.Item className="breadActive" key={item}>{breadcrumbMap[item]}</Breadcrumb.Item>
      }
    })}
  </Breadcrumb>
})
