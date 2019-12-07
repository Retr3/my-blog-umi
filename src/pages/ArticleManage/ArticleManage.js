
import React from 'react';
import styles from './ArticleManage.css';
import {Icon, Button, Input, Row, Col, Card, Modal, Tooltip} from 'antd';
const { Meta } = Card;
const { confirm } = Modal;
const { Search } = Input;
class ArticleManage extends React.Component {
  state={
    isShowAddItem:false
  }
  showDeleteConfirm = () =>{
    confirm({
      title: '确定要删除该文章吗?',
      content: '删除后可联系管理员恢复',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  addArticle = () =>{
    let isShowAddItem = !this.state.isShowAddItem;
    const element = document.querySelector('#article');
    element.classList.add('animated', 'zoomOutDown','slow')
    element.addEventListener('animationend', ()=>{ 
        this.setState({
          isShowAddItem
        },()=>{
          element.classList.remove('animated', 'zoomOutDown')
          element.classList.add('animated', 'zoomInDown')
        })
    })
  }
  render() {
    return (
      <div id="article" className={styles['search-panel']}>
        {!this.state.isShowAddItem?<div>
          <Row gutter={[16,16]}>
            <Col span={24}>
              <div className={styles['search-input']}>
                <Search
                  placeholder="输入文章标题"
                  enterButton="搜索"
                  size="large"
                  onSearch={value => console.log(value)}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={[16,16]} className={styles['add-panel']}>
            <Col span={24}>
              <Button onClick={this.addArticle}><Icon type="plus" />添加文章</Button>
            </Col>
          </Row>
          <Row gutter={[16,16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
                actions={[
                  <Tooltip placement={"bottom"} title="修改">
                    <Icon type="edit" key="edit" />
                  </Tooltip>,
                  <Tooltip title="删除" placement={"bottom"}>
                    <Icon type="delete" key="delete" onClick={this.showDeleteConfirm} />
                  </Tooltip>
                ]}
              >
                <Meta
                  
                  title="Card title"
                  description="This is the description"
                />
              </Card>
            </Col>
          </Row>
        </div>:<div><Button onClick={this.addArticle}>返回</Button></div>}
        
      </div>
    )}
}
export default ArticleManage
