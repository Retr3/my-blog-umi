import React from 'react';
import { connect } from 'dva';
import { Tabs, Icon, Table, BackTop, Statistic, Row, Col, Card, Button } from 'antd';
import styles from './Visitor.css';
const { Column, ColumnGroup } = Table;
const { TabPane } = Tabs;
const displayClick ={
  color:'#333333',
  cursor: 'not-allowed'
}
@connect(state=>({
  showVisitorInfo:state.appVisitor.showVisitorInfo,
  loginVisitorInfo:state.appVisitor.loginVisitorInfo,
  staticData:state.appVisitor.staticData,
  blackList:state.appBlackList.blackListInfo
}),{
  //列表
  getShowVisitorInfoFn: () => ({
    type: "appVisitor/getShowVisitorInfoFn"
  }),
  getLoginVisitorInfoFn: () => ({
    type: "appVisitor/getLoginVisitorInfoFn"
  }),
  getVisitorStaticInfoFn: () => ({
    type: "appVisitor/getVisitorStaticInfoFn"
  }),
  //黑名单
  getBlackListFn: () => ({
    type: "appBlackList/getBlackListFn"
  }),
  addBlackListInfoFn: ip =>({
    type: "appBlackList/addBlackListInfoFn",ip
  }),
  delBlackListInfoFn: ip =>({
    type: "appBlackList/delBlackListInfoFn",ip
  })
})
class Visitor extends React.Component{
  state={
    loading:false
  }
  columns = [
    {
      title: '访问时间',
      dataIndex: 'visit_time',
      key: 'visit_time'
    },{
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },{
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },{
      title:'',
      dataIndex:'blackFlag',
      key:'blackFlag',
      width:0
    },{
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          {record.blackFlag?
          <span style={this.state.loading?displayClick:{}} className={styles['icon-action']}  onClick={()=>this.state.loading?"":this.delBlackList(record.ip)}>
            <i className="iconfont icon-blacklist"></i>&nbsp;取消拉黑
          </span>:
          <span style={this.state.loading?displayClick:{}} className={styles['icon-action']}  onClick={()=>this.state.loading?'':this.addBlackList(record.ip)}>
            <i className="iconfont icon-blacklist"></i>&nbsp;加入黑名单
          </span>}
        </span>
      )
    }];
  loginColumns = [
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width:'20%'
    },{
      title: '访问时间',
      dataIndex: 'visit_time',
      key: 'visit_time',
      ellipsis: true,
      width:'25%'
    },{
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
      width:'15%'
    },{
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      ellipsis: true,
      width:'20%'
    },{
      title:'',
      dataIndex:'blackFlag',
      key:'blackFlag',
      width:0
    },{
      title: '操作',
      key: 'action',
      ellipsis: true,
      width:'20%',
      render: (text, record) => (
        <span>
          {record.blackFlag?
          <span style={this.state.loading?displayClick:{}} className={styles['icon-action']}  onClick={()=>this.state.loading?"":this.delBlackList(record.ip)}>
            <i className="iconfont icon-blacklist"></i>&nbsp;取消拉黑
          </span>:
          <span style={this.state.loading?displayClick:{}} className={styles['icon-action']}  onClick={()=>this.state.loading?'':this.addBlackList(record.ip)}>
            <i className="iconfont icon-blacklist"></i>&nbsp;加入黑名单
          </span>}
        </span>
      )
    }];
  pagination={
    showSizeChanger:true,
    pageSizeOptions:['10','25','50'],
    onShowSizeChange:(current, pageSize)=> {
      console.log(current, pageSize);
    }
  }
  async componentDidMount(){
    const {getShowVisitorInfoFn,getLoginVisitorInfoFn,getBlackListFn,getVisitorStaticInfoFn} = this.props;
    await getVisitorStaticInfoFn();
    await getBlackListFn();
    await getShowVisitorInfoFn();
    getLoginVisitorInfoFn();
  }
  delBlackList = async key => {
    this.setState({
      loading:true
    })
    await this.props.delBlackListInfoFn(key);
    this.setState({
      loading:false
    })
  }
  addBlackList = async key => {
    this.setState({
      loading:true
    })
    await this.props.addBlackListInfoFn(key);
    this.setState({
      loading:false
    })
  }
  render(){
    const { showVisitorInfo, loginVisitorInfo, blackList, staticData } = this.props;
    return (
      <div className={styles['visitor-dom']}>
        <Row gutter={[16,16]}>
          <Col span={24}>
            <Card bordered={false} className={styles['visitor-titlepanel']}>
              <Row>
                <Col span={8}>
                  <Statistic valueStyle={{ color: '#1890ff' }} className={styles['title-card']} title="今日访问次数" value={staticData?staticData.todayVisitor:0} prefix={<Icon type="user" />} />
                </Col>
                <Col span={8}>
                    <Statistic valueStyle={{ color: '#1890ff' }} className={styles['title-card']} title="本周访问次数" value={staticData?staticData.weekVisitor:0} prefix={<Icon type="team" />} />
                </Col>
                <Col span={8}>
                    <Statistic valueStyle={{ color: '#1890ff' }} style={{textAlign:'center'}} title="累计访问次数" value={staticData?staticData.totalVisitor:0} prefix={<Icon type="pie-chart" theme="filled" />} />
                </Col>
              </Row>
            </Card>
          </Col>    
        </Row>
        <Row gutter={[16,16]}>
          <Col span={24}>
            <Tabs defaultActiveKey="1" tabPosition="left" className={styles['visitor-tablepanel']}>
                <TabPane
                  tab={<span><Icon type="solution" />前台访问记录</span>}
                  key="1"
                >
                 <Table 
                    loading={false}
                    columns={this.columns} 
                    dataSource={showVisitorInfo?showVisitorInfo.map(item=>{
                      let blackFlag = !!blackList.find(value=>value===item.ip)
                      return {...item,blackFlag}
                    }):[]} 
                    pagination={this.pagination}
                  />
                </TabPane>
                <TabPane
                  tab={<span><Icon type="key" />后台登录记录</span>}
                  key="2"
                >
                  <Table 
                    
                    columns={this.loginColumns} 
                    dataSource={loginVisitorInfo?loginVisitorInfo.map(item=>{
                      let blackFlag = !!blackList.find(value=>value===item.ip)
                      return {...item,blackFlag}
                    }):[]} 
                    pagination={this.pagination}
                  />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
          <BackTop className={styles['visitor-backup']} visibilityHeight={200} />
      </div>
    )
  }
}
export default Visitor
