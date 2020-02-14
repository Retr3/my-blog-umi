import React from 'react';
import { connect } from 'dva';
import styles from './ArticleManage.css';
import AddorUpdateArticle from './AddorUpdateArticle';
import {Icon, Button, Input, Row, Col, Card, Modal, Tooltip, Tag, Empty } from 'antd';
import getTags from '../../utils/getTagsFn.js'
const { Meta } = Card;
const { confirm } = Modal;
const { Search } = Input;

@connect(state=>({articleList:state.appArticleList.articleList}),{
  getAppArticleList: articleName => ({
    type: "appArticleList/getAppArticleListFn", articleName
  }),
  delArticle: (articleId, reloadFn) =>({
    type: "appArticleList/delArticleFn",
    articleId,
    reloadFn
  })
})
class ArticleManage extends React.Component {
  state={
    isShowAddItem:false,
    visibleMoreInfo:false,
    updateId:'',
    articleDetails:'',
    articleListAction:''
  }
  componentDidMount(){
    this.getArticleListFn('');
  }
  //查询列表数据
  getArticleListFn= async value =>{
    await this.props.getAppArticleList(value);
    this.setState({
      articleListAction:this.props.articleList
    })
  }
  showDeleteConfirm = articleId =>{
    let that = this;
    confirm({
      title: '确定要删除该文章吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.props.delArticle(articleId,that.getArticleListFn);
      }
    });
  }
  //文章详情信息
  detailsModel = async item =>{
    let visibleMoreInfo = !this.state.visibleMoreInfo;
    const tagsInfoList = await getTags(item.tags);
    item.tagsInfoList = !!tagsInfoList?tagsInfoList:[];
    this.setState({
      articleDetails:item
    },()=>{
      this.setState({
        visibleMoreInfo
      })
    })
  }
  //页面切换
  toggleArticle = async articleId =>{
    let that = this;
    let updateId = !!articleId?articleId:'';
    let isShowAddItem = !that.state.isShowAddItem;
    //const element = document.querySelector('#article');
    this.animateCSS('#article','bounceOutRight','slow',()=>{
      that.setState({
        updateId,
        isShowAddItem
      },()=>{
        //console.log(updateId+' '+isShowAddItem);
        that.animateCSS('#article','bounceInRight','slow')
      })
    })
  }
  //过渡动画方法回调
  animateCSS = (element, animationName,speed, callback) =>{
    const node = document.querySelector(element)
    node.classList.add('animated', animationName, speed)
    function handleAnimationEnd() {
        node.classList.remove('animated', animationName, speed)
        node.removeEventListener('animationend', handleAnimationEnd)
        if (typeof callback === 'function') callback()
    }
    node.addEventListener('animationend', handleAnimationEnd)
  }
  //查询方法
  searchArticle = value =>{
    this.getArticleListFn(value);
  }
  // searchArticleFn = value =>{
  //   let articleListAction = this.props.articleList.filter(item => item.article_title.indexOf(value)>-1 );

  //   this.setState({articleListAction});
  // }
  render() {
    const { articleDetails,articleListAction } = this.state;
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
                  onSearch={value => this.searchArticle(value)}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={[16,16]} className={styles['add-panel']}>
            <Col span={24}>
              <Button onClick={()=>this.toggleArticle('')}><Icon type="plus" />添加文章</Button>
            </Col>
          </Row>
          <Row gutter={[16,16]}>
            {!!articleListAction&&articleListAction.length>0?articleListAction.map((item,index)=>{
                return <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt="cover"
                        src={'http://127.0.0.1:7070'+item.imagepath}
                      />
                    }
                    actions={[
                      <Tooltip placement={"bottom"} title="修改">
                        <Icon type="edit" key="edit" onClick={()=>this.toggleArticle(item.id)} />
                      </Tooltip>,
                      <Tooltip title="删除" placement={"bottom"}>
                        <Icon type="delete" key="delete" onClick={()=>this.showDeleteConfirm(item.id)} />
                      </Tooltip>,
                      <Tooltip title="更多信息" placement={"bottom"}>
                        <Icon type="ellipsis" key="ellipsis" onClick={()=>this.detailsModel(item)} />
                      </Tooltip>
                    ]}
                  >
                    <Meta
                      title={item.article_title}
                      description={item.created_at+'创建'}
                    />
                  </Card>
                </Col>
            }):<Empty style={{'marginTop':'200px'}} description={'暂无文章信息'}/>}
          </Row>
        </div>:<div>
            <AddorUpdateArticle toggleArticle={this.toggleArticle} getArticleListFn={this.getArticleListFn} updateId={this.state.updateId}></AddorUpdateArticle>
          </div>}
         <Modal
          title="文章信息"
          closable={false}
          visible={this.state.visibleMoreInfo}
          destroyOnClose={true}
          footer={[
            <Button key="primary" type="primary" onClick={()=>this.setState({visibleMoreInfo:false})}>确定</Button>
          ]}
        >{(!!articleDetails)?
          <div>
            <p><span style={{marginRight:'10px'}}>文章名:</span>{ articleDetails.article_title }</p>
            <p><span style={{marginRight:'10px'}}>作者:</span>{ articleDetails.username }</p>
            <p><span style={{marginRight:'10px'}}>文章创建时间:</span>{ articleDetails.created_at }</p>
            <p><span style={{marginRight:'10px'}}>最后更新时间:</span>{ articleDetails.updated_at }</p>
            <div><span style={{marginRight:'10px'}}>标签:</span>
              { articleDetails.tagsInfoList.map((item,index)=>{
              return <Tag key={'tags'+index} color="red">{item.content}</Tag>
            })}
            </div>
          </div>:''}
        </Modal>
      </div>
    )}
}
export default ArticleManage
