import { Row, Col, Card, List, Skeleton } from 'antd'
import styles from './Home.css';
import { connect } from 'dva';
import { useEffect } from "react";
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import  Piepercent  from "../../components/Charts/PiePercent";

export default connect(state=>({
    staticInfo:state.appHome.staticList,
    actionInfo:state.appHome.actionInfo,
    abilityInfo:state.appHomeAbility.chartData,
    loginRecordInfo:state.appHomeRecord.loginRecordData
}),{
    getActionInfo: () => ({
      type: "appHome/homeInfoFn"
    }),
    getStaticInfo: () => ({
      type: "appHome/homeStaticInfoFn"
    }),
    getAbilityInfo:()=>({
      type: "appHomeAbility/appAbilityFn"
    }),
    getRecordInfo:()=>({
      type: "appHomeRecord/appRecordFn"
    })
  })(
    function({staticInfo,actionInfo,abilityInfo,loginRecordInfo,getActionInfo,getStaticInfo,getAbilityInfo,getRecordInfo}) {
        const listName = ['服务器环境','服务器版本','CPU信息','内存容量'];
        const colorList = ['#40c9c6','#36a3f7','#f4516c','#ffba00'];
        const iconList = ['icon-system','icon-edition','icon-cpu','icon-memory'];
        const loginListIcon = ['icon-time','icon-user1','icon-location'];
        //(待实现)每天0,6,12,18点取一次(定时器)更新abilityInfo
        useEffect(() => {
            getStaticInfo();
            getActionInfo();
            getAbilityInfo();
            getRecordInfo();
          },[getAbilityInfo, getActionInfo, getRecordInfo, getStaticInfo]);
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
                                        <span className={styles["text-content"]}>{staticInfo[index]}</span>
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
                        {(abilityInfo&& abilityInfo.length>0)?<Chart height={550} data={abilityInfo} className={styles['chart-item']}>
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
                        </Chart>:<div className={styles['chart-item']}><div  style={{height:'559px'}}></div></div>}
                     </Card>
                </Col>
                <Col xl={{span:12}} md={{span:24}} xs={{span:24}}>
                  <Card title='当前使用情况' bordered={false}  bodyStyle={{padding:0}}>
                    { !!Object.keys(actionInfo).length ?<Row gutter={[12,12]}>
                      <Col  xl={{span:12}} md={{span:24}} xs={{span:24}}>
                        <Piepercent pieData={actionInfo.memDv} pietitle={'内存使用率'} pieInfo={actionInfo.MemRate} peiheight={268} pieColor={actionInfo.meColor}></Piepercent>
                      </Col>
                      <Col  xl={{span:12}} md={{span:24}} xs={{span:24}}>
                        <Piepercent pieData={actionInfo.cpuDv} pietitle={'CPU使用率'} pieInfo={actionInfo.cpuLoad} peiheight={268} pieColor={actionInfo.cpuColor}></Piepercent>
                      </Col>
                    </Row>:<Row gutter={[12,12]} style={{height:"268px"}}></Row>}
                    <Row>
                      <Col span={24}>
                      <List style={{borderBottom:"1px solid #e8e8e8"}}>
                          {true?<List.Item>
                              <Row className={styles["list-item"]} style={{color:"#09b8d9"}}>
                                <Col span={4}>
                                  <div className={`iconfont icon-time2`}></div>
                                </Col>
                                <Col span={10}>服务器运行时间</Col>
                                <Col span={10}>2h</Col>
                              </Row>
                            </List.Item>:<List.Item>
                                <Row className={styles["list-item"]}>
                                  <Skeleton avatar paragraph={{ rows: 0 }} />
                                </Row>
                              </List.Item>}
                        </List>
                        <List itemLayout="horizontal">
                          {(loginRecordInfo && loginRecordInfo.length>0)?loginRecordInfo.map((item,index)=>{
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
