import React from 'react';
import BraftEditor from 'braft-editor'
import { connect } from 'dva';
//import { ContentUtils } from 'braft-utils'
import styles from './ArticleManage.css';
import {Select, Button, Input, Row, Col, BackTop, Modal, Form, Upload, Icon, message} from 'antd';
import preview from '../../utils/braftFn'
import 'braft-editor/dist/index.css'
// 引入表情包扩展模块样式文件
import 'braft-extensions/dist/emoticon.css'
// 引入表情包扩展模块和默认表情包列表
import Emoticon, { defaultEmoticons } from 'braft-extensions/dist/emoticon'
// 转换默认表情包列表，让webpack可以正确加载到默认表情包中的图片，请确保已对png格式的文件配置了loader
// 如果你使用的webpack版本不支持动态require，或者使用的其他打包工具，请勿使用此写法
const emoticons = defaultEmoticons.map(item => require(`braft-extensions/dist/assets/${item}`))
// 也可以使用自己的表情包资源，不受打包工具限制
// const emoticons = ['http://path/to/emoticon-1.png', 'http://path/to/emoticon-2.png', 'http://path/to/emoticon-3.png', 'http://path/to/emoticon-4.png', ...]
const options = {
    //includeEditors: ['article-editor'], // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
    emoticons: emoticons, // 指定可用表情图片列表，默认为空
    closeOnBlur: true, // 指定是否在点击表情选择器之外的地方时关闭表情选择器
    closeOnSelect: false // 指定是否在选择表情后关闭表情选择器，默认false
}
const { Option } = Select;
const { confirm } = Modal;
const imgTypeList = ['image/jpeg','image/jpg','image/png','image/gif','image/bmp']
function beforeUpload(file) {
    const isImg = !!(imgTypeList.indexOf(file.type)>-1);
    if (!isImg) {
      message.warning('请上传正确的图片格式');
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.warning('请上传小于3M的图片');
    }
    return isImg && isLt3M;
  }
BraftEditor.use(Emoticon(options))
@connect(state=>({articleInfo:state.appArticle.articleInfo}),{
    getArticleInfoFn: articleId => ({
        type: "appArticle/getArticleInfoFn",
        articleId
    }),
    addOrUdpateArticleFn: (articleData,reloadFn) => ({
        type: "appArticle/addOrUdpateArticleFn",
        articleData,
        reloadFn
    }),
    resetArticleInfoFn: ()=> ({
        type: "appArticle/resetArticleInfo",
    })
  })
@Form.create()
class AddorUpdateArticle extends React.Component {
    state = {
        editorState: null,
        backConfirm:false,
        fileList: [],
        previewVisible: false,
        previewImage: '',//返回图片地址
        imgName:''//图片名
    }
    async componentDidMount(){
        const { updateId, getArticleInfoFn } = this.props;
        console.log(updateId); 
        if(!!updateId){
            await getArticleInfoFn(updateId);
            this.setState({
                fileList:[{
                        name: this.props.articleInfo.img_name,
                        uid:'-1',
                        status: 'done',
                        url: this.props.articleInfo.img_path,
                        thumbUrl: this.props.articleInfo.img_path,
                    }],
                previewImage: this.props.articleInfo.img_path,//预览图地址
                imgName:this.props.articleInfo.img_name
            })
         }
    }
    componentWillUnmount(){
        this.props.resetArticleInfoFn();
    }
    //确认返回上一页
    confirmBack = () => {
        const { getFieldValue } = this.props.form;
        const { toggleArticle } = this.props;
        const articleText = getFieldValue('content');
        if(!articleText || articleText.isEmpty()){
            toggleArticle('')
        }else{
            confirm({
                title: '您有未提交的修改，确定返回列表页面吗?',
                content: '未提交的内容不会进行保存',
                onOk() {
                    toggleArticle('')
                },
                onCancel() {},
            });
        }
    }
    //提交
    submitContent =  async (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                console.log('Received values of form: ', values);
                // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
                //虽然html字符串也可以用于持久化存储，但是对于比较复杂的富文本内容，在反复编辑的过程中，可能会存在格式丢失的情况，
                //比较标准的做法是在数据库中同时存储raw字符串和html字符串，分别用于再次编辑和前台展示。
                //具体相关展示与数据转换方法参考https://www.yuque.com/braft-editor/be/lzwpnr
                const htmlContent = this.state.editorState.toHTML();
                const rawJSON = this.state.editorState.toRAW(true);
                // console.log('json',rawJSON);
                // console.log('htmlis '+htmlContent);
                this.props.addOrUdpateArticleFn({
                    id:this.props.updateId,
                    article_title:values.article_title,
                    article_tags:values.article_tags,
                    img_name:this.state.imgName,
                    img_path:this.state.previewImage,
                    braft_row:rawJSON,
                    braft_html:htmlContent},this.props.toggleArticle);
            }
        })
        //const result = await saveEditorContent(htmlContent)
    }
    handleEditorChange = (editorState) => {
    this.setState({ editorState })
    console.log(editorState.toHTML())
    }
    //上传变化
    uploadHandleChange = info => {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`封面上传成功`);
          this.setState({
            previewImage:info.file.response.url,
            imgName:info.file.response.name
          })
        } else if (status === 'error') {
          message.error(`封面上传失败`);
        }
        this.setState({
            fileList:info.fileList
        })
      };
    //上传图片预览
    coverPreview = () =>{
        let previewVisible = !this.state.previewVisible;
        this.setState({
            previewVisible
        })
    }
    render() {
        const { editorState } = this.state
        const extendControls = [
            {
              key: 'custom-button',
              type: 'button',
              text: '预览',
              className: 'my-button', 
              onClick: ()=>{editorState?preview(editorState.toHTML()):message.warning('您还没有编辑过内容')}
            }
        ]
        //展示插件
        const controls = BraftEditor.defaultProps.controls.map(item => {
            return item === 'media' ? {
              key: 'media', // 使用key来指定控件类型
              title: '添加图片', // 自定义控件title
            } : item
        })
        //不需要的插件
        const excludeControls = ['fullscreen']
        const media ={
            accepts:{
                video:false,
                audio:false
            },
            externals:{
                image:true,
                video:false,
                audio:false,
                embed:false
            }
        }
        const { getFieldDecorator } = this.props.form;
        const { articleInfo } = this.props;
        const selectChild = [];
        for (let i = 1; i < 6; i++) {
            selectChild.push(<Option key={'stag'+i} value={'标签'+i}>{'标签'+i}</Option>);
        }
        return (
            <div>
                <Row>
                    <Col span={24} style={{textAlign: 'right'}}>
                        <Button onClick={this.confirmBack}>返回</Button>
                    </Col>
                </Row>
                <Row>
                    <Form onSubmit={this.submitContent}>
                        <Col span={24}>
                            <Form.Item label="文章标题">
                                {getFieldDecorator('article_title', {
                                    initialValue:articleInfo.article_title?articleInfo.article_title:null,
                                    validateFirst:true,
                                    rules: [{required: true,message: '请输入标题'},
                                        {whitespace:true,message:'标题不能存在空格'},
                                        {max:30,message:'标题最多30个字'}]
                                })(
                                    <Input maxLength={30} size="large" placeholder="请输入标题"/>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="文章封面">
                                {getFieldDecorator('img_cover', {
                                    initialValue:''
                                })(
                                    <Upload
                                    accept=".jpeg,.jpg,.png,.gif,.bmp"
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    listType="picture"
                                    beforeUpload={beforeUpload}
                                    fileList={this.state.fileList}
                                    onPreview={this.coverPreview}
                                    onChange={this.uploadHandleChange}
                                    showUploadList={{showPreviewIcon:true,showRemoveIcon: true,showDownloadIcon: false}}
                                  >
                                    {this.state.fileList.length >0 ? null : <Button>
                                        <Icon type="upload" /> 上传图片
                                    </Button>}
                                  </Upload>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="文章标签">
                                {getFieldDecorator('article_tags', {
                                    initialValue:articleInfo.article_tags,
                                    validateFirst:true,
                                    rules: [{required: true,message: '请最少选择一个标签'},{
                                            validator: (_, value, callback) => {
                                                if(value.length>4){
                                                    callback('最多选择5个标签')
                                                }
                                                callback()
                                            }
                                        }]
                                })(
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        maxTagCount={4}
                                        placeholder="请选择一个或多个标签"
                                    >
                                        {selectChild}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="文章正文">
                                {getFieldDecorator('content', {
                                    initialValue:articleInfo.braft_row?BraftEditor.createEditorState(articleInfo.braft_row):null,
                                    validateTrigger:'onBlur',
                                    rules: [{
                                        required: true,
                                        validator: (_, value, callback) => {
                                            
                                            if (!value || value.isEmpty()) {
                                                callback('请输入正文内容')
                                            } else {
                                                callback()
                                            }
                                        }
                                    }]
                                })(
                                    <BraftEditor
                                        className={styles['braft-dom']}
                                        id="article-editor"
                                        controls={controls}
                                        media={media}
                                        excludeControls = {excludeControls}
                                        extendControls = {extendControls}
                                        onChange={this.handleEditorChange}
                                    // onSave={this.submitContent}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item>
                                <Button size="large" type="primary" htmlType="submit">提交</Button>
                            </Form.Item>       
                        </Col>
                    </Form>
                    </Row>
                <Modal closable={false} visible={this.state.previewVisible} footer={null} onCancel={this.coverPreview}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <BackTop className={styles['article-backup']} visibilityHeight={200} />
            </div>)
    }
}
export default AddorUpdateArticle