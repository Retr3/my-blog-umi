
import React from 'react';
import { Upload, message, Icon, Input, Modal, Button, Spin, Progress } from 'antd';
import styles from './Resume.css';
import axios from 'axios'
const { Dragger } = Upload;
const CancelToken = axios.CancelToken;
let  cancel;
class ResumeUpload extends React.Component {
  state={
    fileList:[],
    remarks:'',
    uploading:false,
    visible:false,
    percent:0,
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
      const formData = new FormData();
      formData.append('files[]', fileList[0]);
      formData.append("remarks", this.state.remarks);
      axios({
        url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        method: 'post',
        cancelToken: new CancelToken(function (c) {
          cancel = c;
        }),
        data: formData,
        onUploadProgress: function (progressEvent) {
          that.setState({
            percent:parseInt((progressEvent.loaded/progressEvent.total)*100)
          })
        },
      }).then(res=>{
        message.success(`${this.state.fileList[0].name} 上传成功`);
        this.setState({
          uploading:false,
          fileList:[],
          percent:0
        })
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
  render() {
    return (
      <div>
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
                 <Spin tip="上传中,请稍等..."></Spin>
                 <Progress
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
        <Modal
          title="备注"
          visible={this.state.visible}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleModel}>
              确定
            </Button>
          ]}
        >
          <Input placeholder="写点备注吧(最多50个字)" maxLength={50} />
        </Modal>
      </div>
    );
  }
}
export default ResumeUpload
