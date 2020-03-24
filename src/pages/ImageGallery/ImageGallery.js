import React, { Component } from 'react'
import styles from './ImageGallery.css'
import Shuffle from 'shufflejs'
import axios from 'axios'
import { connect } from 'dva';
import { Form, Empty, Select, Upload, Card, Modal, message, BackTop, Col, Button, Icon, Radio, Progress } from 'antd'
const { Dragger } = Upload;
const { Option } = Select;
const CancelToken = axios.CancelToken;
let  cancel;
const typeList = ['image/jpeg','image/jpg','image/png','image/gif','image/bmp'];
@connect(state=>({
    galleryInfo:state.appGallery.galleryInfo
}),{
    getGalleryInfoFn: () => ({
        type: "appGallery/getGalleryInfoFn"
    }),
    delGalleryFn: (id,reloadFn) => ({
        type: "appGallery/delGalleryFn",
        id,
        reloadFn
    })
})
@Form.create()
class ImageGallery extends Component {
    state={
        radioValue:'a',
        visible:false,
        typeVisible:false,
        imgSrc:'',
        delId:'',//删除id
        photos:[],
        fileList:[],
        uploading:false,
        percent:0,
        type:'',
        cancelUpload:false//取消上传标记
    }
    async componentDidMount(){
     // console.log(this.props.location.pathname);
        this.galleryInit();
    }
    //初始化
    galleryInit= async ()=>{
        await this.props.getGalleryInfoFn();
        const galleryInfo = this.props.galleryInfo;
        this.setState({
            photos:!!galleryInfo?galleryInfo:[],
            radioValue:'a'
        },()=>{
            this.shuffle = new Shuffle(this.shuffleDemo, {
                itemSelector: '.photo-item',
                sizer: this.sizer,
            });
            this._whenPhotosLoaded(this.state.photos);
            this.shuffle.filter('other');
            this.shuffle.filter();
        })
        
    }
    // componentDidUpdate() {
    //      this.shuffle.resetItems();
    // }
    componentWillUnmount() {
        this.shuffle.destroy();
        this.shuffle = null;
    }
    _whenPhotosLoaded(photos) {
        return Promise.all(photos.map(photo => new Promise((resolve) => {
            const image = document.createElement('img');
            image.src = photo.src;

            if (image.naturalWidth > 0 || image.complete) {
                resolve(photo);
            } else {
                image.onload = () => {
                    resolve(photo);
                };
            }
        })));
    }
    showImg = (imgSrc, delId) => {
        this.setState({
            imgSrc,
            delId,
            visible:true
        })
    }
    delImg = id =>{
      this.setState({
        visible:false
      })
      let that = this;
      this.props.delGalleryFn(id,that.galleryInit);
    }
    /*---上传方法---*/
    beforeUpload = file => {
        const isImg = !!(typeList.indexOf(file.type)>-1);
        if (!isImg) {
            message.warning('请上传正确的图片格式');
            return false;
        }
        const isLt5M = (file.size / 1024 / 1024) < 10;
        if (!isLt5M) {
            message.warning('请上传小于10M的图片');
            return false;
        }
        this.setState({
          fileList: [file],
          typeVisible:true
        })
        return false;
      }
      uploadFile = () =>{
        let that = this;
        this.setState({
          uploading:true
        },()=>{
          const { fileList } = this.state;
          let size = '1x1';
          let style = 'one';
          var reader = new FileReader();
          reader.readAsDataURL(fileList[0]);
          reader.onload = function(theFile) {
          　　var image = new Image();
            image.src = theFile.target.result;
            image.onload = function() {
              size = (this.width/this.height)>=1.5?'1x1':'1x2'
              style = this.width>1000?'two':'one'
            };
          };
          let formData = new FormData();
          formData.append("size", size);
          formData.append("style", style);
          formData.append("type", this.state.type);
          formData.append("userid", JSON.parse(window.localStorage.getItem('userinfo')).userid);
          formData.append('file',fileList[0])
          axios.post('/api/gallery',formData,{
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
              this.galleryInit();
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
        this.props.form.validateFields((err, values) => {
            if(!err){
                console.log(values);
                this.setState({
                    typeVisible:false,
                    type:values.type.join(',')
                },()=>{
                  this.uploadFile();
                })
            }
        })
      }
      //取消
      handleCancel = () =>{
        this.setState({
            typeVisible:false,
            uploading:false,
            fileList:[],
            percent:0,
            cancelUpload:false
          })
      }
    /*---上传方法end---*/
    render() {
        const selectChildren = [];
        const optionList = ['生活','风景','影视','游戏','其他'];
        const valueList = ['life','scenery','film','game','other']
        const { getFieldDecorator } = this.props.form;
        for (let i = 0; i < optionList.length; i++) {
            selectChildren.push(<Option key={valueList[i]}>{optionList[i]}</Option>);
        }
        return (
            <div>
                <div style={{padding:'32px', height:'300px'}}>
                <Dragger 
                className={styles["my-upload"]}
                multiple={false}
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
                        <p className={styles["my-upload-text"]}>单击或拖动上传图片</p>
                        <p className={styles["my-upload-hint"]}>
                            支持jpg/png/jpeg/gif/bmp格式
                        </p>
                    </div>}
                </Dragger>
                </div>
                <div style={{padding:'0 32px'}}>
                    <Card bordered={false}>
                        <Radio.Group onChange={e=>{this.setState({radioValue:e.target.value})}} value={this.state.radioValue} buttonStyle="solid">
                            <Radio.Button value="a"  onClick={()=>this.shuffle.filter()}>全部</Radio.Button>
                            <Radio.Button value="b" onClick={()=>this.shuffle.filter('life')}>生活</Radio.Button>
                            <Radio.Button value="c" onClick={()=>this.shuffle.filter('scenery')}>风景</Radio.Button>
                            <Radio.Button value="d" onClick={()=>this.shuffle.filter('film')}>影视</Radio.Button>
                            <Radio.Button value="e" onClick={()=>this.shuffle.filter('game')}>游戏</Radio.Button>
                            <Radio.Button value="f" onClick={()=>this.shuffle.filter('other')}>其他</Radio.Button>
                        </Radio.Group>
                    </Card>
                </div>
                <div style={{padding: '20px 32px',minHeight:500}}>
                    <div ref={(div)=>this.shuffleDemo=div} style={{minHeight:500}}>
                        {
                            !!this.state.photos && this.state.photos.length>0?
                            this.state.photos.map((item,index)=>(
                                <div
                                    className={'photo-item '+styles[item.style]}
                                    data-groups={JSON.stringify(item.groups)}
                                    onClick={()=>this.showImg(item.src,item.id)}
                                     key={item.src}>
                                    <div className={'aspect aspect--'+item.size}>
                                        <div className='aspect__inner'>
                                            <img src={item.src} alt="" width='100%' height='100%'/>
                                        </div>
                                    </div>
                                </div>
                            )):<Empty style={{'marginTop':'100px'}} description={'暂无图片'}/>
                        }
                       <Col span={1} ref={(div)=>this.sizer = div}></Col>
                    </div>
                </div>
                <Modal
                    closable={false}
                    visible={this.state.visible}
                    onCancel={()=>this.setState({visible:false})}
                    footer={[
                      <Button key="submit" type="danger" onClick={()=>this.delImg(this.state.delId)}>删除</Button>
                    ]}
                    >
                    <img src={this.state.imgSrc} alt="" width='100%' />
                </Modal>
                <Modal
                    title="选择图片类型"
                    visible={this.state.typeVisible}
                    destroyOnClose={true}
                    footer={[
                        <Button key="submit" type="primary" onClick={this.handleModel}>
                        确定
                        </Button>,
                        <Button key="cancel" type="normal" onClick={this.handleCancel}>
                        取消
                        </Button>
                    ]}
                    >
                        <Form.Item label="">
                            {getFieldDecorator('type', {
                                rules: [{required: true,message: '请选择图片类型'}]
                            })(
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="请选择图片类型"
                                >
                                    {selectChildren}
                                </Select>
                            )}
                        </Form.Item>
                </Modal>
                <BackTop visibilityHeight={200} style={{right: 50}}/>
            </div>
        )
    }
}
export default ImageGallery