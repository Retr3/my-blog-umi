import React from 'react';
import { connect } from 'dva';
import styles from './Personal.css';
import { Upload, Card, Row, Col, Button, Icon, Divider, Table, Tabs, message, Progress, Modal, Input, List, Avatar,Tooltip, Form, Spin } from 'antd';
import PanThumb from '../../components/PanThumb/PanThumb'
import MyTags from '../../components/MyTags/MyTags'
import ModifyPassword from '../../components/ModifyPassword/ModifyPassword'
import ModifyPersonal from '../../components/ModifyPersonal/Modifypersonal'
import { isIp } from '../../utils/validator'
import loadImgAsync from '../../utils/imageLoad'
import copy from 'copy-to-clipboard';
import coverImg from '../../assets/images/cover.jpg';
import avatarImg from '../../assets/images/avatar.jpg';
const { TabPane } = Tabs;
const imgTypeList = ['image/jpeg','image/jpg','image/png','image/gif','image/bmp'];
@connect(state=>({
  blackList:state.appBlackList.blackListInfo,
  tagsInfo:state.appTags.tags,
  registerCode:state.appRegisterCode.registerCode,
  avatarPath: state.appPersonal.avatarPath,
}),{
  getBlackListFn: () => ({
    type: "appBlackList/getBlackListFn"
  }),
  addBlackListInfoFn: (ip,loation) =>({
    type: "appBlackList/addBlackListInfoFn",ip,loation
  }),
  delBlackListInfoFn: ip =>({
    type: "appBlackList/delBlackListInfoFn",ip
  }),
  getTagsFn:() =>({
    type: "appTags/getTagsFn"
  }),
  updateTagsFn:tags =>({
    type: "appTags/updateTagsFn",tags
  }),
  delTagsFn:id =>({
    type: "appTags/delTagsFn",id
  }),
  getRegisterCodeFn:() =>({
    type: "appRegisterCode/getRegisterCodeFn"
  }),
  setAvatarFn: (id, path) =>({
    type: "appPersonal/setAvatarFn",id, path
  })
})
class Personal extends React.Component{
  state = {
    avatarUrl:'',
    autograph:'',//签名
    occupation:'',
    company:'',
    location:'',
    nickname:'',
    team:[],
    tags: [],//tags值
    tagInputVisible: false,//tags输入框状态
    tagValue: '',//输入的tags值
    loading:false,
    fileList:[],//upload filelist
    percent:0,//upload进度
    modelVisible:false,//黑名单模态框
    ModifyPasswordVisible:false,//密码模态框
    tagsVisible:false,//标签模态框
    ModifyPersonalVis:false,//个人信息框
    blackIp:'',
    ipValidateStatus:'',
    ipHelp:'',
    avatarLoad:true
  };
  settingList = [{
    title:'修改密码',
    description:'对密码进行修改',
    active:[<a href="a" onClick={e=>{    
      e.preventDefault();
      this.repasswordModel(true);
    }} 
    key="password-edit">修改</a>]
  },{
    title:'文章标签管理',
    description:'文章标签最多8个',
    active:[<a href="b" onClick={e=>{    
      e.preventDefault();
      this.showTagsModel();
      }}  key="article-tags">管理</a>]
  },{
    title:'注册码生成',
    description:'生成系统注册码',
    active:[<a href="c" onClick={e=>{    
      e.preventDefault();
      this.generateCode();
      }}  key="article-tags">生成</a>]
  },{
    title:'个人信息',
    description:'个人信息修改',
    active:[<a href="c" onClick={e=>{    
      e.preventDefault();
      this.personInfo(true);
      }}  key="article-tags">修改</a>]
  }]
  componentDidMount(){
    this.props.getBlackListFn();
    this.initUserInfo();
    loadImgAsync(coverImg).then(url=>{
      this.setState({
        avatarLoad:false
      })
    }).catch(err=>{
      console.log('图片加载失败'+err)
    })
  }
  // 设置用户信息
  initUserInfo = async () =>{
    const userinfo = JSON.parse(window.localStorage.getItem('userinfo'));
    this.setState({
      autograph:userinfo.sign,
      occupation:userinfo.occupation,
      company:userinfo.company,
      location:userinfo.location,
      nickname:userinfo.nickname,
      team: !!userinfo.team ?userinfo.team.split(',') :[]
    })
    if(!!userinfo.imagepath){
      this.setState({
        avatarUrl: userinfo.imagepath
      })
    }
  }
  //tags
  removeTag = async removedTag => {
    await this.props.delTagsFn(removedTag);
    this.setState({
      tags:this.props.tagsInfo
    })
  };

  showTagInput = () => {
    this.setState({ tagInputVisible: true }, () => this.input.focus());
  };

  tagInputChange = e => {
    this.setState({ tagValue: e.target.value });
  };

  tagInputConfirm = () => {
    const { tagValue } = this.state;
    let { tags } = this.state;
    if (tagValue && tags.findIndex(item=>tagValue === item.content) === -1) {
      tags = [...tags, {userid:JSON.parse(window.localStorage.getItem('userinfo')).userid,content:tagValue}];
    }
    console.log(tags);
    this.setState({
      tags,
      tagInputVisible: false,
      tagValue: '',
    });
  };

  tagSaveInputRef = input => (this.input = input);
  
  showTagsModel = async () =>{
    await this.props.getTagsFn();
    this.setState({
      tags:this.props.tagsInfo,
      tagsVisible:true
    })
  }
  //标签提交
  submitTags = async () => {
    //this.state.tags
    await this.props.updateTagsFn(this.state.tags);
    this.setState({
      tagsVisible:false
    })
  }
  //upload
  beforeUpload = file =>{
    const isImg = !!(imgTypeList.indexOf(file.type)>-1);
    if (!isImg) {
      message.warning('请上传图片格式文件');
      return false;
    }
    const isLt5M = (file.size / 1024 / 1024) < 5;
    if (!isLt5M) {
      message.warning('只能上传小于5M的图片!');
      return false;
    }
    return isImg && isLt5M;
  }
  uploadChange = async info => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file.percent);
    }
    if (status === 'done') {
      this.setState({
        loading:false,
        fileList:[]
      })
      const that = this;
      if(info.file.response.code === 0){
        await that.props.setAvatarFn(info.file.response.id, info.file.response.url);
        that.setState({
          avatarUrl: JSON.parse(window.localStorage.getItem('userinfo')).imagepath
        })
      }
      return ;
    } else if (status === 'error') {
      message.error(`头像上传失败`);
      this.setState({
        loading:false
      })
      return ;
    } else if(status === 'uploading'){
      this.setState({
        loading:true
      })
    }
    this.setState({
      fileList:info.fileList,
      percent:!!info.file.percent?parseInt(info.file.percent.toFixed(0)):0
    })
  }

  //code
  generateCode = async () => {
    //生成注册码方法
    await this.props.getRegisterCodeFn();
    let code = this.props.registerCode;
    if(code){
      Modal.success({
        title: '注册码生成成功',
        okText:'确定',
        //content: <Paragraph copyable>{code}</Paragraph>
        content: <Tooltip title="点击复制"><div className={styles['code-model']} onClick={()=>this.copyCode(code)}>{code}</div></Tooltip>
      });
    }
  }
  //copyCode
  copyCode = (code) =>{
    copy(code);
    message.success('复制成功');
  }
  //table
  pagination={
    showSizeChanger:true,
    pageSizeOptions:['10','25','50'],
    onShowSizeChange:(current, pageSize)=> {
      console.log(current, pageSize);
    }
  }
  columns = [
    {
      title: 'ip',
      dataIndex: 'ip',
      key: 'ip'
    },{
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },{
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <span className={styles['icon-action']}  onClick={()=>{this.props.delBlackListInfoFn(record.ip)}}>
            <i className="iconfont icon-blacklist"></i>&nbsp;取消拉黑
          </span>
        </span>
      )
    }];
  //resetpassword
  submitRePassword = () =>{
    this.child.submitRePassword()
  }
  repasswordModel = visible =>{
    this.setState({
      ModifyPasswordVisible:visible
    })
  }
  onRef = (ref) => {
    this.child = ref
  }
  //confirmip
  confirmBlackIp = e =>{
    let { value } = e.target;
    this.setState({
      blackIp:value
    })
    this.confirmIp(value);
  }
  addBlackInfo = () =>{
    let { blackIp } = this.state;
    const { addBlackListInfoFn } = this.props;
    let flag = this.confirmIp(blackIp);
    if(flag){
      addBlackListInfoFn(blackIp);
      this.setState({modelVisible:false,ipHelp:'',ipValidateStatus:''})
    }
  }
  confirmIp = value =>{
    const { blackList } = this.props;
      if(value && isIp(value)){
        if(blackList.findIndex(item=>item.ip === value)<0){
          this.setState({
            ipValidateStatus:'success',
            ipHelp:''
          })
          return true
        }else{
          this.setState({
            ipValidateStatus:'error',
            ipHelp:'该ip已经存在于黑名单'
          })
          return false;
        }
      }else{
        this.setState({
          ipValidateStatus:'error',
          ipHelp:'请输入正确的ip格式'
        })
        return false;
      }
  }
  //个人信息修改
  personInfo = visible =>{
    this.setState({
      ModifyPersonalVis:visible
    })
  }
  //个人信息提交
  submitPersonal = async () =>{
    await this.child.submitPersonal();
  }
  render(){
    const { avatarUrl, nickname, occupation, company, location, team, autograph, tags, tagInputVisible, tagValue, loading, percent,modelVisible, ModifyPasswordVisible, tagsVisible, ipValidateStatus, ipHelp, avatarLoad, ModifyPersonalVis } = this.state;
    const { blackList } = this.props;
    const headers = window.localStorage.getItem("token")?{"Authorization": `Bearer ${window.localStorage.getItem("token")}`}:''
    const teamImg = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
      return (
        <div>
          <Row gutter={[16,30]}>
            <Col span={8}>
              <Card  
                cover={avatarLoad?<div className={styles['avatar-img']}><Spin /></div>:<img style={{height:'200px'}} alt="example" src={coverImg}/>}
                className={styles['panel-body']}>
                  <div className={styles['avatar-head']}>
                    <PanThumb 
                      width="100px" 
                      height='100px' 
                      zIndex='1' 
                      imgUrl={!!avatarUrl?"https://api.mimiron.cn"+avatarUrl:avatarImg}
                      >
                      <div id="personal-upload" className={styles['avatar-upload']}>
                        <Upload 
                          name='file'
                          disabled={loading}
                          action = {process.env.NODE_ENV==='development'?'/api/imagelist':'https://api.mimiron.cn/api/imagelist'}
                          headers = {headers}
                          accept=".png,.jpg,.jpeg,.bmp,.gif"
                          fileList={this.state.fileList}
                          beforeUpload={this.beforeUpload}
                          onChange={this.uploadChange}
                        >
                          {!loading?<div>
                            <Icon type="edit" />
                            <div>上传头像</div>
                          </div>:<div><Progress type="circle" width={60} percent={percent} format={percent => percent===100?<Icon type="check"></Icon>:`${percent}%`} /></div>}
                        </Upload>
                      </div>
                    </PanThumb>
                  </div>
                  <div className={styles['avatar-text']}>
                    <div className={styles['avatar-name']}>
                      {nickname}
                    </div>
                    <div>
                      <div>{!!autograph?autograph:'这个人很懒，没有留下任何签名'}</div>
                    </div>
                  </div>
                  <div className={styles["avatar-info"]}>
                          <p><i className="iconfont icon-post"></i>{!!occupation?occupation:'暂无职位'}</p>
                          <p><i className="iconfont icon-cluster"></i>{!!company?company:'暂无公司'}</p>
                          <p><i className="iconfont icon-location2"></i>{!!location?location:'暂无定位城市'}</p>
                  </div>
                  <Divider dashed={true} />
                  <div className={styles['team-title']}>团队</div>
                  <Row gutter={16}>
                    {
                      team.length>0?team.map((item, index)=>(
                        <Col span={12} key={item+index}>
                          <span className={styles['team-text']} style={{padding:'5px 0'}}>
                            <Avatar size="small" style={{'marginRight':'5px'}}src={teamImg} />
                            <span>{item}</span>
                          </span>
                        </Col>
                      )):<div style={{padding:'7px'}}>暂无团队</div>
                    }
                  </Row>
              </Card>
            </Col>
            <Col span={16}>
              <Card className={styles['panel-body']}>
              <Tabs defaultActiveKey="1">
                <TabPane  id="personal-list" tab="系统设置" key="1">
                 <List 
                    itemLayout="horizontal"
                    dataSource={this.settingList}
                    renderItem={item => (
                      <List.Item actions={item.active}>
                        <List.Item.Meta
                          title={item.title}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />

                </TabPane>
                <TabPane tab="黑名单" key="2">
                  <Button onClick={()=>{this.setState({modelVisible:true})}} className={styles['blacklist-btn']}><Icon type="plus"></Icon>新增</Button>
                  <Table 
                    loading={false}
                    columns={this.columns} 
                    dataSource={blackList.map(item=>({...item,key:item.id}))} 
                    pagination={this.pagination}
                  />
                </TabPane>
              </Tabs>
              </Card>
            </Col>
          </Row>
            <Modal
              title="添加黑名单IP"
              visible={modelVisible}
              destroyOnClose={true}
              onOk={this.addBlackInfo}
              onCancel={()=>{this.setState({modelVisible:false,ipHelp:'',ipValidateStatus:''})}}
              okText='添加'
            >
              <Form.Item
                validateStatus={ipValidateStatus}
                hasFeedback
                help={ipHelp}
              >
                <Input placeholder="请输入ip地址" onChange={e=>this.confirmBlackIp(e)}/>
              </Form.Item>
              

          </Modal>
          <Modal
            title="修改密码"
            visible={ModifyPasswordVisible}
            destroyOnClose={true}
            onOk={this.submitRePassword}
            onCancel={()=>{this.repasswordModel(false)}}
            okText='确定'
            cancelText="取消"
          >
              <ModifyPassword onRef={this.onRef} repasswordModel={this.repasswordModel} ></ModifyPassword>
          </Modal>
          <Modal
            title="文章标签管理"
            visible={tagsVisible}
            destroyOnClose={true}
            onOk={this.submitTags}
            onCancel={()=>{this.setState({tagsVisible:false})}}
            okText='确定'
            cancelText="取消"
          >
            <MyTags
                tags={tags}
                tagInputVisible={tagInputVisible}
                tagValue={tagValue}
                removeTag={this.removeTag}
                showTagInput={this.showTagInput}
                tagInputChange={this.tagInputChange}
                tagInputConfirm={this.tagInputConfirm}
                tagSaveInputRef={this.tagSaveInputRef}
                limit={8}
            ></MyTags>
          </Modal>
          <Modal
            title="个人信息修改"
            visible={ModifyPersonalVis}
            destroyOnClose={true}
            onOk={this.submitPersonal}
            onCancel={()=>{this.setState({ModifyPersonalVis:false})}}
            okText='确定'
            cancelText="取消"
          >
            <ModifyPersonal onRef={this.onRef} initUserInfo = {this.initUserInfo} personInfo={this.personInfo} ></ModifyPersonal>
          </Modal>
        </div>
      );
  }
}
export default Personal;
