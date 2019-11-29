
import React from 'react';
import { Upload, message, Icon } from 'antd';
import styles from './Resume.css'
const { Dragger } = Upload;

class ResumeUpload extends React.Component {
  state={
    fileList:[]
  }
  uploadProps = {
    name: 'file',
    multiple: true,
    accept:".doc,.docx,.pdf",
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  }; 
  uploadOnChange = (info)=> {
    const { status } = info.file;
    let newFileList = info.fileList;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
      newFileList=[];
    }
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
    this.setState({ fileList: newFileList });
  }
  beforeUpload = (file)=>{
    const isDocOrPdf = file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/pdf';
    if (!isDocOrPdf) {
      message.error('请上传doc/docx/pdf文件');
    }
    const isLt20M = (file.size / 1024 / 1024) < 20;
    if (!isLt20M) {
      message.error('只能上传小于20M的文件!');
    }
    return isDocOrPdf && isLt20M;
  }
  uploadRemove = ()=>{
    message.warning(`取消上传`);
  }
  render() {
    return (
      <div>
        <Dragger 
          {...this.uploadProps} 
          className={styles["my-upload"]} 
          fileList={this.state.fileList}
          beforeUpload={this.beforeUpload}
          onChange={this.uploadOnChange}
          onRemove={this.uploadRemove}
          >
          <p className={styles["my-upload-drag-icon"]}>
            <Icon type="inbox" />
          </p>
          <p className={styles["my-upload-text"]}>单击或拖动上传文件</p>
          <p className={styles["my-upload-hint"]}>
              支持单次或批量上传。只支持doc/docx/pdf文件上传
          </p>
        </Dragger>
      </div>
    );
  }
}
export default ResumeUpload
