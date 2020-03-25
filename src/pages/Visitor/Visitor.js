import React from 'react';
import { connect } from 'dva';
import { Tabs, Icon, Table, BackTop, Statistic, Row, Col, Card } from 'antd';
import styles from './Visitor.css';
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
  getShowVisitorInfoFn: (page, pagesize) => ({
    type: "appVisitor/getShowVisitorInfoFn", page, pagesize
  }),
  getLoginVisitorInfoFn: (page, pagesize) => ({
    type: "appVisitor/getLoginVisitorInfoFn", page, pagesize
  }),
  getVisitorStaticInfoFn: () => ({
    type: "appVisitor/getVisitorStaticInfoFn"
  }),
  //黑名单
  getBlackListFn: () => ({
    type: "appBlackList/getBlackListFn"
  }),
  addBlackListInfoFn: (ip,location) =>({
    type: "appBlackList/addBlackListForVisitFn",ip,location
  }),
  delBlackListInfoFn: ip =>({
    type: "appBlackList/delBlackListInfoFn",ip
  })
})
class Visitor extends React.Component{
  state={
    loading:false,
    vistotal:0,
    logintotal:0
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
          <span style={this.state.loading?displayClick:{}} className={styles['icon-action']}  onClick={()=>this.state.loading?'':this.addBlackList(record.ip,record.location)}>
            <i className="iconfont icon-blacklist"></i>&nbsp;加入黑名单
          </span>}
        </span>
      )
    }];
  loginColumns = [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      ellipsis: true,
      width:'20%'
    },{
      title: '访问时间',
      dataIndex: 'login_time',
      key: 'login_time',
      ellipsis: true,
      width:'25%'
    },{
      title: '位置',
      dataIndex: 'login_place',
      key: 'login_place',
      ellipsis: true,
      width:'15%'
    },{
      title: 'IP地址',
      dataIndex: 'login_ip',
      key: 'login_ip',
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
          <span style={this.state.loading?displayClick:{}} className={styles['icon-action']}  onClick={()=>this.state.loading?"":this.delBlackList(record.login_ip)}>
            <i className="iconfont icon-blacklist"></i>&nbsp;取消拉黑
          </span>:
          <span style={this.state.loading?displayClick:{}} className={styles['icon-action']}  onClick={()=>this.state.loading?'':this.addBlackList(record.login_ip, record.login_place)}>
            <i className="iconfont icon-blacklist"></i>&nbsp;加入黑名单
          </span>}
        </span>
      )
    }];
  async componentDidMount(){
    const {getShowVisitorInfoFn,getLoginVisitorInfoFn,getBlackListFn,getVisitorStaticInfoFn} = this.props;
    await getBlackListFn();
    await getShowVisitorInfoFn(1,10);
    await getLoginVisitorInfoFn(1,10);
    getVisitorStaticInfoFn();
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
  addBlackList = async (key,location) => {
    this.setState({
      loading:true
    })
    await this.props.addBlackListInfoFn(key,location);
    this.setState({
      loading:false
    })
  }
  render(){
    const { showVisitorInfo, loginVisitorInfo, blackList, staticData } = this.props;
    const {monthCount,loginData} = staticData;
    const visPagination = {
        showSizeChanger:true,
        pageSizeOptions:['10','25','50'],
        total: monthCount,
        onShowSizeChange:(current, pageSize)=> {
          this.props.getLoginVisitorInfoFn(current, pageSize);
        },
        onChange:(page, pageSize)=>{
          this.props.getShowVisitorInfoFn(page, pageSize);
        }
    }
  const loginPagination = {
      showSizeChanger:true,
      pageSizeOptions:['10','25','50'],
      total: loginData,
      onShowSizeChange:(current, pageSize)=> {
        this.props.getLoginVisitorInfoFn(current, pageSize);
      },
      onChange:(page, pageSize)=>{
        this.props.getLoginVisitorInfoFn(page, pageSize);
      }
  }
    return (
      <div className={styles['visitor-dom']}>
        <Row gutter={[16,16]}>
          <Col span={24}>
            <Card bordered={false} className={styles['visitor-titlepanel']}>
              <Row>
                <Col span={8}>
                  <Statistic valueStyle={{ color: '#1890ff' }} className={styles['title-card']} title="今日访问次数" value={staticData?staticData.dayCount:0} prefix={<Icon type="user" />} />
                </Col>
                <Col span={8}>
                    <Statistic valueStyle={{ color: '#1890ff' }} className={styles['title-card']} title="本周访问次数" value={staticData?staticData.weekCount:0} prefix={<Icon type="team" />} />
                </Col>
                <Col span={8}>
                    <Statistic valueStyle={{ color: '#1890ff' }} style={{textAlign:'center'}} title="累计访问次数" value={staticData?staticData.totalCount:0} prefix={<Icon type="pie-chart" theme="filled" />} />
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
                    dataSource={showVisitorInfo?showVisitorInfo.map((item, index)=>{
                      let blackFlag = !!blackList.find(value=>value.ip===item.ip)
                      return {...item,blackFlag, key:('visit'+index)}
                    }):[]} 
                    pagination={visPagination}
                  />
                  {/* <Pagination/> */}
                </TabPane>
                <TabPane
                  tab={<span><Icon type="key" />后台登录记录</span>}
                  key="2"
                >
                  <Table 
                    
                    columns={this.loginColumns} 
                    dataSource={loginVisitorInfo?loginVisitorInfo.map((item, index)=>{
                      let blackFlag = !!blackList.find(value=>value.ip===item.login_ip)
                      return {...item,blackFlag, key:('login'+index)}
                    }):[]} 
                    pagination={loginPagination}
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
