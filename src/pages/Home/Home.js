import { Row, Col, Card, List, Skeleton, Spin, Icon, Empty } from 'antd'
import styles from './Home.css';
import { connect } from 'dva';
import { useEffect } from "react";
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import  Piepercent  from "../../components/Charts/PiePercent";
import io from 'socket.io-client';
export default connect(state=>({
    staticInfo:state.appHome.staticList,
    loginrecord:state.appHome.loginrecord,
    actionInfo:state.appHome.actionInfo,
    abilityInfo:state.appHomeAbility.chartData
}),{
    getActionInfo: msg => ({
      type: "appHome/homeInfoFn",msg
    }),
    getStaticInfo: () => ({
      type: "appHome/homeStaticInfoFn"
    }),
    getAbilityInfo:()=>({
      type: "appHomeAbility/appAbilityFn"
    })
  })(
    function({staticInfo,actionInfo,abilityInfo,getActionInfo,getStaticInfo,getAbilityInfo,loginrecord,location}) {
        const listName = ['服务器环境','服务器版本','CPU信息','内存容量'];
        const colorList = ['#40c9c6','#36a3f7','#f4516c','#ffba00'];
        const iconList = ['icon-system','icon-edition','icon-cpu','icon-memory'];
        const loginListIcon = ['icon-time','icon-user1','icon-location'];
        // useEffect(() => {
        //   console.log(location.pathname);
        // },[location.pathname])
        //(待实现)每天0,6,12,18点取一次(定时器)更新abilityInfo
        useEffect(() => {
            getStaticInfo();
            getAbilityInfo();
          },[getAbilityInfo, getStaticInfo]);
        useEffect(() => {
          const socket = io('http://49.235.45.43:2333/actionlist', {
            query: {
              token: `Bearer ${window.localStorage.getItem("token")}`
            }
          });
          socket.on('connect', () => {
            console.log('connect');
            socket.emit('actionlist');
          });
          socket.on('actionlist',msg=>{
            getActionInfo(msg);
          })
          // 系统事件
          socket.on('disconnect', msg => {
            console.log('断开连接', msg);
          });
          socket.on('disconnecting', () => {
            console.log('#disconnecting');
          });
          socket.on('error', () => {
            console.log('error');
          });
          window.socket = socket;
          return ()=>{
            window.socket.close();
          }
        },[getActionInfo]);
      return (
        <div >
            <Row gutter={[16,16]}>
                {staticInfo.length>0?staticInfo.map((item,index)=>{
                    return <Col key={item} xl={{span:6}} md={{span:12}} xs={{span:12}}>
                                <Card 
                                    bordered={false}
                                    hoverable
                                    bodyStyle={{padding:0}}
                                    className={styles["card-panel"]}>
                                    <div className={`iconfont ${iconList[index]} ${styles["icon-panel"]}`} style={{fontSize:'36px',color:colorList[index]}}></div>
                                    <div className={styles["text-panel"]}>
                                    <div className={styles["text-title"]}>{listName[index]}</div>
                                      <span style={index === 1?{fontSize:'12px'}:{fontSize:'18px'}}>{staticInfo[index]}</span>
                                    </div>
                                </Card>
                            </Col>
                }):listName.map(item=>{
                  return  <Col key={item} xl={{span:6}} md={{span:12}} xs={{span:12}}>
                            <Card 
                                bordered={false}
                                hoverable
                                bodyStyle={{padding:0}}
                                className={styles["skeleton-card"]}>
                                <Skeleton avatar paragraph={{ rows: 1 }} />
                            </Card>
                          </Col>
              })}
            </Row>
            <Row gutter={[16,16]}>
                <Col xl={{span:12}} md={{span:24}} xs={{span:24}}>
                     <Card title='7天服务器性能情况' bordered={false}  bodyStyle={{padding:0}}>
                        {(abilityInfo&& abilityInfo.length>0)?<Chart height={550} forceFit={true} data={abilityInfo} className={styles['chart-item']}>
                        <Legend />
                        <Axis name="day" />
                        <Axis
                          name="percentage"
                          label={{
                            formatter: val => `${val}%`
                          }}
                        />
                        <Tooltip crosshairs={{type: 'y'}}
                          itemTpl= {`<li data-index={index}> <span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{name}: {value}%</li>`}
                        />
                        <Geom 
                          type="line"
                          size={3}
                          color={['type', ['#096dd9', '#faad14']]}
                          shape={"smooth"}
                          position="day*percentage" />
                        <Geom
                          type="point"
                          position="day*percentage"
                          size={4}
                          shape={"circle"}
                          color={['type', ['#096dd9', '#faad14']]}
                          
                          style={{
                            stroke: "#fff",
                            lineWidth: 1
                          }}
                        />
                        </Chart>:<div className={styles['chart-item']}><div  style={{height:'559px'}}><Empty className={styles['chart-empty']} description={'暂时还没有足够的数据进行展示'}/></div></div>}
                     </Card>
                </Col>
                <Col xl={{span:12}} md={{span:24}} xs={{span:24}}>
                  <Card title='当前使用情况' bordered={false}  bodyStyle={{padding:0}}>
                    { !!Object.keys(actionInfo).length ?<Row gutter={[12,12]}>
                      <Col  xl={{span:12}} md={{span:24}} xs={{span:24}}>
                        <Piepercent pieData={actionInfo.memDv} pietitle={'内存使用率'} pieInfo={actionInfo.memRate} peiheight={268} pieColor={actionInfo.meColor}></Piepercent>
                      </Col>
                      <Col  xl={{span:12}} md={{span:24}} xs={{span:24}}>
                        <Piepercent pieData={actionInfo.cpuDv} pietitle={'CPU使用率'} pieInfo={actionInfo.cpuuse} peiheight={268} pieColor={actionInfo.cpuColor}></Piepercent>
                      </Col>
                    </Row>:<Row className={styles["spin"]} gutter={[12,12]} style={{height:"268px"}}>
                        <Spin size="large" tip="正在获取服务器性能..." indicator={<Icon type="loading" style={{ fontSize: 32 }} spin />}></Spin>
                      </Row>}
                    <Row>
                      <Col span={24}>
                      <List style={{borderBottom:"1px solid #e8e8e8"}}>
                          {true?<List.Item>
                              <Row className={styles["list-item"]} style={{color:"#09b8d9"}}>
                                <Col span={4}>
                                  <div className={`iconfont icon-time2`}></div>
                                </Col>
                                <Col span={10}>服务器运行时间</Col>
                                <Col span={10}>{(!!actionInfo && actionInfo.uptime>0)?(actionInfo.uptime/60/60).toFixed(1)+'h':'0'}</Col>
                              </Row>
                            </List.Item>:<List.Item>
                                <Row className={styles["list-item"]}>
                                  <Skeleton avatar paragraph={{ rows: 0 }} />
                                </Row>
                              </List.Item>}
                        </List>
                        <List itemLayout="horizontal">
                          {(!!loginrecord && loginrecord.length>0)?loginrecord.map((item,index)=>{
                              return (
                                <List.Item key={item.title}>
                                  <Row className={styles["list-item"]} style={{color:`#36a3f7`}}>
                                    <Col span={4}>
                                      <div className={`iconfont ${loginListIcon[index]}`}></div>
                                    </Col>
                                    <Col span={10}>{item.title}</Col>
                                    <Col span={10}>{item.value}</Col>
                                  </Row>
                                </List.Item>
                              )
                            }):['1','2','3'].map( item=>{
                              return <List.Item key={item}>
                                        <Row className={styles["list-item"]}>
                                        <Skeleton avatar paragraph={{ rows: 0 }} />
                                      </Row>
                                    </List.Item>
                            })}
                        </List>
                      </Col>
                    </Row>
                  </Card>
                </Col>

            </Row>
        </div>
      );
    }
)
