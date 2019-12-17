import React from 'react';
import styles from './Personal.css';
import { Upload, Card, Row, Col, Button, Icon, Typography, Divider, Table, Tabs, message } from 'antd';
import PanThumb from '../../components/PanThumb/PanThumb'
import MyTags from '../../components/MyTags/MyTags'
const { Paragraph } = Typography;
const { TabPane } = Tabs;
const imgTypeList = ['image/jpeg','image/jpg','image/png','image/gif','image/bmp']
class Personal extends React.Component{
  state = {
    autograph:'个性签名',//签名
    tags: ['Tag 1', 'Tag 2', 'Tag 3'],
    tagInputVisible: false,
    tagValue: '',
    loading:false,
    fileList:[]
  };
  //签名fn
  autographChange = text =>{
    this.setState({
      autograph:text
    })
  }
  //tags
  removeTag = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
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
    if (tagValue && tags.indexOf(tagValue) === -1) {
      tags = [...tags, tagValue];
    }
    console.log(tags);
    this.setState({
      tags,
      tagInputVisible: false,
      tagValue: '',
    });
  };

  tagSaveInputRef = input => (this.input = input);
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
  uploadChange = info => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`头像上传成功`);
      this.setState({
        loading:false
      })
    } else if (status === 'error') {
      message.error(`头像上传失败`);
      this.setState({
        loading:false
      })
    } else if(status === 'uploading'){
      this.setState({
        loading:true
      })
    }
    this.setState({
        fileList:[]
    })
  }
  //table
  dataSource = [
    {
      key: '1',
      ip: '胡彦斌',
      location: 32
    },
    {
      key: '2',
      ip: '胡彦斌',
      location: 32
    },{
      key: '3',
      ip: '胡彦斌',
      location: 32
    },{
      key: '4',
      ip: '胡彦斌',
      location: 32
    },
  ];
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
          <span className={styles['icon-action']}  onClick={()=>{}}>
            <i className="iconfont icon-blacklist"></i>&nbsp;取消拉黑
          </span>
        </span>
      )
    }];
  render(){
    const { tags, tagInputVisible, tagValue, autograph, loading } = this.state;
      return (
        <div>
          <Row gutter={[16,30]}>
            <Col span={8}>
              <Card  
                cover={<img style={{maxHeight:'200px'}} alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"/>}
                className={styles['panel-body']}>
                  <div className={styles['avatar-head']}>
                    <PanThumb 
                      width="100px" 
                      height='100px' 
                      zIndex='1' 
                      imgUrl='https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'
                      >
                      <div className={styles['avatar-upload']}>
                       { !loading?<Upload 
                          name='file'
                          multiple={false}
                          action = 'https://www.mocky.io/v2/5cc8019d300000980a055e76'
                          accept=".png,.jpg,.jpeg,.bmp,.gif"
                          fileList={this.state.fileList}
                          beforeUpload={this.beforeUpload}
                          onChange={this.uploadChange}
                        >
                          <Icon type="edit" />
                          <div>上传头像</div>
                        </Upload>:<div><Icon type="loading" />上传中</div>}
                      </div>
                    </PanThumb>
                  </div>
                  <div className={styles['avatar-text']}>
                    <div className={styles['avatar-name']}>
                      Rick
                    </div>
                    <div>
                      <Paragraph ellipsis={true} editable={{ onChange: this.autographChange }}>{autograph}</Paragraph>
                    </div>
                  </div>
                  <div className={styles["avatar-info"]}>
                    <p><i className="iconfont icon-post"></i>前端工程师</p>
                    <p><i className="iconfont icon-cluster"></i>XX公司,XX事业处,XX部门</p>
                    <p><i className="iconfont icon-location2"></i>中国 上海市</p>
                  </div>
                  <Divider dashed={true} />
                  <div className={styles['tags-title']}>标签</div>
                  <MyTags
                     tags={tags}
                     tagInputVisible={tagInputVisible}
                     tagValue={tagValue}
                     removeTag={this.removeTag}
                     showTagInput={this.showTagInput}
                     tagInputChange={this.tagInputChange}
                     tagInputConfirm={this.tagInputConfirm}
                     tagSaveInputRef={this.tagSaveInputRef}
                  ></MyTags>
              </Card>
            </Col>
            <Col span={16}>
              <Card className={styles['panel-body']}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="系统设置" key="1">
                 修改密码-旧密码 新密码 确认新密码
                 文章数量
                 文章标签管理
                 注册码生成
                </TabPane>
                <TabPane tab="黑名单" key="2">
                  <Button className={styles['blacklist-btn']}><Icon type="plus"></Icon>新增</Button>
                  <Table 
                    loading={false}
                    columns={this.columns} 
                    dataSource={this.dataSource} 
                    pagination={this.pagination}
                  />
                </TabPane>
              </Tabs>
              </Card>
            </Col>
          </Row>
        </div>
      );
  }
}
export default Personal;
