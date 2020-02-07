
import React from 'react';
import { connect } from 'dva';
import { Upload, message, Icon, Input, Modal, Button, Progress, Row, Col, Card, List, Popconfirm, Descriptions, Empty } from 'antd';
import styles from './Resume.css';
import axios from 'axios'
const { Dragger } = Upload;
const CancelToken = axios.CancelToken;
let  cancel;
@connect(state=>({fileListData:state.appResume.fileListData}))
class ResumeUpload extends React.Component {
  state={
    fileList:[],
    remarks:'',
    uploading:false,
    visible:false,
    percent:0,
    deleting:false,
    fileInfo:'',
    cancelUpload:false//取消上传标记
  }
  uploadProps = {
    name: 'file',
    multiple: false,
    accept:".doc,.docx,.pdf",
  };
  showUploadList={
    showPreviewIcon: false, 
    showRemoveIcon: true, 
    showDownloadIcon: false
  }
  componentDidMount(){
    this.props.dispatch({type:"appResume/getFileListFn"});
  }
  beforeUpload = async (file)=>{
    const isDocOrPdf = file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/pdf';
    if (!isDocOrPdf) {
      message.error('请上传doc/docx/pdf文件');
      return false;
    }
    const isLt20M = (file.size / 1024 / 1024) < 20;
    if (!isLt20M) {
      message.error('只能上传小于20M的文件!');
      return false;
    }
    this.setState({
      fileList: [file],
      visible:true
    })
    return false;
  }
  uploadFile = () =>{
    let that = this;
    this.setState({
      uploading:true
    },()=>{
      const { fileList } = this.state;

      let formData = new FormData();
      formData.append("remarks", this.state.remarks);
      formData.append('filesize',fileList[0].size)
      formData.append("userid", JSON.parse(window.localStorage.getItem('userinfo')).userid);
      formData.append('file',fileList[0])
      axios.post('/api/appendix',formData,{
        headers: {
          'Content-Type':'multipart/form-data'
        },
        cancelToken: new CancelToken(function (c) {
          cancel = c;
        }),
        onUploadProgress: function (progressEvent) {
          that.setState({
            percent:parseInt((progressEvent.loaded/progressEvent.total)*100)
          })
        },
      })
      .then(async res=>{
        const code = await res.data.code;
        if(code === 0){
          message.success(`${this.state.fileList[0].name} 上传成功`);
          this.setState({
            uploading:false,
            fileList:[],
            percent:0
          })
          this.props.dispatch({type:"appResume/getFileListFn"});
        }else{
          message.error(`${this.state.fileList[0].name} 上传失败`)
          this.setState({
            uploading:false,
            fileList:[],
            percent:0,
            cancelUpload:false
          })
        }
        
      }).catch(err=>{
        if(!this.state.cancelUpload){message.error(`${this.state.fileList[0].name} 上传失败`);}
        console.log(err);
        this.setState({
          uploading:false,
          fileList:[],
          percent:0,
          cancelUpload:false
        })
      })
    })
  }
  uploadCancel=()=>{
    this.setState({
      cancelUpload:true
    },()=>{
      cancel();
      message.warning(`取消上传`);
    })
  }
  handleModel = ()=>{
    this.setState({
      visible:false
    },()=>{
      this.uploadFile();
    })
  }
  handleRemark = e=>{
    this.setState({
      remarks:e.target.value
    })
  }
  removeFile = async (id) =>{
    this.setState({
      deleting:true
    })
    await this.props.dispatch({type:"appResume/deleteFileFn",fileId:id});
    this.setState({
      deleting:false
    })
  }
  downloadFile = (path, filename) =>{
    //新建窗口模拟下载
    this.props.dispatch({type:"appResume/downloadFileFn",data:{path, filename}});
  }
  //显示文件详细信息
  showFileInfo = item=>{
    this.setState({
      fileInfo:item
    })
  }
  render() {
    return (
      <div>
        <Row gutter={[16,16]}>
          <Col span={24} className={styles["col-upload"]}>
            <Dragger 
              {...this.uploadProps} 
              className={styles["my-upload"]} 
              fileList={this.state.fileList}
              beforeUpload={this.beforeUpload}
              disabled={this.state.uploading}
              showUploadList={this.showUploadList}
              >
                {this.state.uploading?
                  <div className={styles["spin-style"]}>
                    <Progress
                        className={styles['upload-progress']}
                        type="circle"
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                        percent={this.state.percent}
                      />
                      <Button  type="primary" onClick={this.uploadCancel}>取消上传</Button>
                  </div>:
                  <div>
                    <p className={styles["my-upload-drag-icon"]}>
                      <Icon type="inbox" />
                    </p>
                    <p className={styles["my-upload-text"]}>单击或拖动上传文件</p>
                    <p className={styles["my-upload-hint"]}>
                        只支持doc/docx/pdf文件上传
                    </p>
                  </div>}
            </Dragger>
          </Col>
        </Row>

        <Row gutter={[16,16]}>
          <Col xl={{span:12}} md={{span:12}} xs={{span:24}}>
            <Card title="已上传附件简历列表" headStyle={{color:"#40a9ff"}} bordered={false}>
            <List
                itemLayout="horizontal"
                locale={{emptyText:<Empty description={'暂无附件简历'} />}}
                className={styles['filelist']}
                dataSource={this.props.fileListData?this.props.fileListData:[]}
                renderItem={item => (
                  <div>
                      {this.state.deleting?
                      <List.Item  key={item.id} className={styles['filelist-item']}>
                        <div>{item.resume_file_name}</div>
                        <div className={styles['item-operate']}>
                          <div><Icon type="download" style={{ fontSize: '16px', color: '#e8e8e8' }} /></div>
                          <div><Icon type="delete" style={{ fontSize: '16px', color: '#e8e8e8' }} /></div>
                        </div>
                      </List.Item>:
                      <List.Item key={item.id} className={styles['filelist-item']}>
                        <span onClick={()=>this.showFileInfo(item)}>{item.resume_file_name}</span>
                        <div className={styles['item-operate']}>
                          <div onClick={()=>this.downloadFile(item.filepath,item.resume_file_name)}><Icon type="download" style={{ fontSize: '16px', color: '#40a9ff' }} /></div>
                          
                          <Popconfirm
                            placement="rightTop"
                            title="确定要删除吗?"
                            onConfirm={(e)=>{ e.stopPropagation();this.removeFile(item.id)}}
                            okText="确定"
                            cancelText="取消"
                          >
                            <div><Icon type="delete" style={{ fontSize: '16px', color: '#40a9ff' }} /></div>
                          </Popconfirm>
                        </div>
                      </List.Item>}
                  </div>
                )}
              />,
            </Card>
          </Col>
          <Col xl={{span:12}} md={{span:12}} xs={{span:24}}>
            {this.state.fileInfo?<Card title="文件详情" headStyle={{color:"#40a9ff"}} bordered={false}>
              <Descriptions column={1}>
                <Descriptions.Item label="文件名"><span className={styles['fileInfo']}>{this.state.fileInfo.resume_file_name}</span></Descriptions.Item>
                <Descriptions.Item label="文件大小"><span className={styles['fileInfo']}>{(this.state.fileInfo.filesize/1024/1024).toFixed(2)+'MB'}</span></Descriptions.Item>
                <Descriptions.Item label="上传用户"><span className={styles['fileInfo']}>{this.state.fileInfo.uploaduser}</span></Descriptions.Item>
                <Descriptions.Item label="上传日期"><span className={styles['fileInfo']}>{this.state.fileInfo.uploadtime}</span></Descriptions.Item>
                <Descriptions.Item label="备注"><span className={styles['fileInfo']}>{this.state.fileInfo.remark}</span></Descriptions.Item>
              </Descriptions>
            </Card>:<Card title="文件信息" headStyle={{color:"#40a9ff"}} bordered={false}><Empty  className={styles['fileinfo-empty']} description={<span style={{color:'rgba(0, 0, 0, 0.4)'}}>点击左侧文件名可查看文件详情信息</span>} /></Card>}
          </Col>
        </Row>
        <Modal
          title="备注"
          visible={this.state.visible}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleModel}>
              确定
            </Button>
          ]}
        >
          <Input placeholder="写点备注吧(最多50个字)" onChange={this.handleRemark} maxLength={50} />
        </Modal>
      </div>
    );
  }
}
export default ResumeUpload
