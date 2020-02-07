import React from 'react';
import { connect } from 'dva';
import { Form, Descriptions, Timeline, Input, Row, Col, Switch, Button, BackTop, Radio, DatePicker, Select, Slider, Icon } from 'antd'
import moment from 'moment';
import cityList from '../../utils/cityList'
import { validEmail, isSpecialSymbol } from '../../utils/validator'
import { momentToStr } from '../../utils/utils'
import styles from './Resume.css'
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
let skillId = 0;
let experienceId = 0;
@connect(state=>({resumeInfo:state.appResumeInfo.resumeInfo}),{
  getResumeInfo: () => ({
    type: "appResumeInfo/getResumeInfoFn"
  }),
  setResumeInfo: (formData, resumeId, that) =>({
    type: "appResumeInfo/updateResumeInfo",
    formData,
    resumeId,
    that
  })
})
@Form.create()
class Resumeonline extends React.Component{
  state={
    editStatus:false,
    loading:false,
    workYears:0,//工作年限
    nowAge:0,//年龄
    //数据
    resumename: "",
    sex:"1",
    birthday: '1994-01',
    email: "",
    education: "",
    occupation: "",
    intentionCity: "",
    entryTime: 0,
    worktime: "2019-01",//工作起始日期
    jobintention: "",
    hobby:"",
    selfdescription: "",
    skills:[],
    slider: [],
    experience: [],
    experiencetime:[]
  }
  //到岗时间
  entryTimeList=[
    '随时','一周内','15天内','一个月'
  ]
  componentDidMount(){
    this.resumeInit();
  }
  //初始化方法
  resumeInit = async () =>{
    await this.props.getResumeInfo();
    if(this.props.resumeInfo){
      this.getResumeValue();
      this.ageChange(moment(this.props.resumeInfo.age));
      this.dateChange(moment(this.props.resumeInfo.worktime));
    }
  }
  descriptTitle =()=>{
    return (
      <div className={styles['switch-style']}>
        <span>个人简历</span>
        <Switch checkedChildren="保存" 
                unCheckedChildren="编辑"
                loading = {this.state.loading}
                onClick={this.changeStatus} 
                checked={this.state.editStatus}/>
      </div>
    )
  } 
  changeStatus = () =>{
   // console.log(this.state.editStatus);
    this.state.editStatus?this.toSaveInfo():this.infoEdit()
  }
  //
  radioChange = e => {
    this.setState({
      sex: e.target.value
    });
  };
  //年龄fn
  ageChange = date => {
    let nowAge = 0;
    if(date){
      let end_date = new Date();
      let start_date = date; 
      nowAge = parseInt(-start_date.diff(end_date, 'months')/12).toFixed(0);
    }
    this.setState({
      nowAge
    })
  }
  //工作时间fn
  dateChange = date => {
    let workYears = 0;
    if(date){
      let end_date = new Date();
      let start_date = date;
      workYears = parseFloat(-start_date.diff(end_date, 'months')/12).toFixed(1);
    }
    this.setState({
      workYears
    })
  }
  //日期限制
  disabledDate = current => {
    return current && current > moment().endOf('month');
  }
  //添加技能
  addSkill = () =>{
    const { form } = this.props;
    const keys = form.getFieldValue('keys');

    const nextKeys = keys.concat(skillId++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  //取消技能
  removeSkill = key =>{
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const skills = this.state.skills.filter((k, i) => i !== key);
    const slider = this.state.slider.filter((k, i) => i !== key);
    this.setState({
      skills,
      slider
    },()=>{
      form.setFieldsValue({
        keys: keys.filter(k => k !== key)
      });
    })
  }
  //添加经历
  addTimeLine = () =>{
    const { form } = this.props;
    const timelines = form.getFieldValue('timelines');
    const nextTimelines = timelines.concat(experienceId++);
    form.setFieldsValue({
      timelines:nextTimelines
    })
  }
  //删除经历
  removeTimeLine = id =>{
    const { form } = this.props;
    const timelines = form.getFieldValue('timelines');
    const experience = this.state.experience.filter((k, i) => i !== id);
    const experiencetime = this.state.experiencetime.filter((k, i) => i !== id);
    this.setState({
      experience,
      experiencetime
    },()=>{
      form.setFieldsValue({
        timelines: timelines.filter(k => k !== id)
      });
    })
  }
  //全局保存
  toSaveInfo = () =>{
    this.props.form.validateFields((err, values) => {
      if (!err) {
       // console.log('Received values of form: ', values);
        this.setState({
          loading:true
        },()=>{
          values.birthday = momentToStr(values.birthday);
          values.worktime = momentToStr(values.worktime);
          values.experiencetime = !!values.experiencetime? values.experiencetime.map(item=>{
            return momentToStr(item) 
          }) :"";
          values.experience = !!values.experience? values.experience.filter(item=>!!item === true): '';
          values.experiencetime = !!values.experiencetime? values.experiencetime.filter(item=>!!item === true): '';
          values.skills = !!values.skills? values.skills.filter(item=>!!item === true): '';
          values.slider = !!values.slider? values.slider.filter(item=>!!item === true): '';
          const { id, experient_tree_list, skill_id_list, userid } = this.props.resumeInfo;
          console.log(values);
          this.props.setResumeInfo({
            name: values.resumename,
            sex: values.sex,
            age: values.birthday,
            email: values.email,
            education: values.education,
            occupation: values.occupation,
            intention_city: values.intentionCity,
            fastest_arrival_time: values.entryTime,
            work_experience: values.worktime,
            job_intention: values.jobintention,
            hobby: values.hobby,
            self_evaluation: values.selfdescription,
            skill_id_list,
            skill_name: values.skills,
            slider: values.slider,
            experience: values.experience,
            experiencetime: values.experiencetime,
            experient_tree_list,
            userid
          },id,this)
        })
      }
    });
  }
  //全局编辑
  infoEdit = () =>{
    this.setState({
      editStatus:true
    })
  }
  getResumeValue = () =>{
    if(this.props.resumeInfo){
      this.setState({
        resumename : this.props.resumeInfo.name,
        sex : this.props.resumeInfo.sex,
        birthday : this.props.resumeInfo.age,
        email : this.props.resumeInfo.email,
        education : this.props.resumeInfo.education,
        occupation : this.props.resumeInfo.occupation,
        intentionCity : this.props.resumeInfo.intention_city,
        entryTime : this.props.resumeInfo.fastest_arrival_time,
        worktime : this.props.resumeInfo.work_experience,
        jobintention : this.props.resumeInfo.job_intention,
        hobby : this.props.resumeInfo.hobby,
        selfdescription : this.props.resumeInfo.self_evaluation,
        skills : !!this.props.resumeInfo.skill_name ? this.props.resumeInfo.skill_name : [],
        slider : !!this.props.resumeInfo.slider ? this.props.resumeInfo.slider : [],
        experience : !!this.props.resumeInfo.experience ? this.props.resumeInfo.experience : [],
        experiencetime : !!this.props.resumeInfo.experiencetime ? this.props.resumeInfo.experiencetime : []
      },()=>{
        this.props.form.setFieldsValue({
          keys: [],
          timelines: []
        });
        this.state.skills.map(()=>{
          return this.addSkill();
        })
        this.state.experience.map(()=>{
          return this.addTimeLine();
        })
      })
    }
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('keys', { initialValue: [] });
    getFieldDecorator('timelines', { initialValue: [] });
    const keys = getFieldValue('keys');
    const timelines = getFieldValue('timelines');
    const  skillItem = keys.map((k, index) => (
              <Row key={k} gutter={[16,16]} className={styles['skill-panel']}>
                <Col span={12}>
                  <Form.Item>
                    {getFieldDecorator(`skills[${k}]`, {
                      initialValue:this.state.skills[index],
                      validateFirst: true,
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: "请输入技能名或删除该项",
                        },{
                          validator:(rule, value, callback) => {
                            !isSpecialSymbol(value)?callback():callback('姓名不能包含符号')
                          }
                        }]
                    })(<Input placeholder="请输入技能特长"/>)}
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item>
                    {getFieldDecorator(`slider[${k}]`,{initialValue:this.state.slider[index]})(<Slider />)}
                  </Form.Item>
                </Col>
                <Col span={2} style={{fontSize:'18px'}}>
                  <div style={{float:'right'}} onClick={() =>{this.removeSkill(k)}}><Icon type="minus-circle" /></div>
                </Col>
            </Row>
          ));
    const jobexperienceItem = timelines.map( (k,index) => (
              <Timeline.Item key={k} className={styles['timeline']}>
                <Form.Item>
                  {getFieldDecorator(`experiencetime[${k}]`, {
                    initialValue:moment(this.state.experiencetime[index]),
                    rules: [
                      {
                        required: true,
                        message: "请选择日期",
                      }]
                  })(<MonthPicker 
                    disabledDate={this.disabledDate} 
                    defaultPickerValue={moment(this.state.experiencetime[index])} 
                    placeholder="选择日期" />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`experience[${k}]`, {
                    initialValue:this.state.experience[index],
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: "请输入经历或删除该经历",
                      }]
                  })(<TextArea className={styles['timeline-textarea']} placeholder="输入经历(最多输入60字)" maxLength={60} autoSize={{ minRows: 2, maxRows: 2 }}/>)}
                  <Button type="danger" onClick={()=>{this.removeTimeLine(k)}}><Icon type="minus" />删除该节点</Button>
                </Form.Item>
              </Timeline.Item>
    ));     
    return (
      <div id="resumeDom" className={styles["resume-dom"]}>
        <Row gutter={[16,16]}>
          <Col span={24}>
            <Descriptions title={this.descriptTitle()} className={styles['resume-info']} bordered column={3}>
              <Descriptions.Item label="姓名">{this.state.editStatus?
              <Form.Item>
                {getFieldDecorator("resumename",{
                  initialValue:this.state.resumename,
                  validateFirst: true,
                  rules: [
                    {
                      required: true,
                      max:5,
                      whitespace: true,
                      message: "请输入姓名(最多5个字)"
                    },
                    {
                      validator:(rule, value, callback) => {
                         !isSpecialSymbol(value)?callback():callback('姓名不能包含符号')
                      }
                    }
                  ]
                })(<Input maxLength={5} placeholder="姓名" />)}
              </Form.Item>
                  :this.state.resumename}
              </Descriptions.Item>
              <Descriptions.Item label="性别">{this.state.editStatus?
                <div>
                  {getFieldDecorator("sex",{initialValue:this.state.sex})(
                    <Radio.Group onChange={this.radioChange} >
                      <Radio value={1}>男</Radio>
                      <Radio value={2}>女</Radio>
                    </Radio.Group>
                  )}
                </div>
                :(this.state.sex=== 1?'男':'女')}
              </Descriptions.Item>
              <Descriptions.Item label="年龄">{this.state.editStatus?
                  <Form.Item className={styles['month-panel']}>
                    {getFieldDecorator("birthday",{
                      initialValue:moment(this.state.birthday),
                      rules: [
                        {
                          required: true,
                          message: "请选择出生日期"
                        }
                      ]
                    })( <MonthPicker 
                      className={styles['month-picker']}
                      onChange={this.ageChange} 
                      defaultPickerValue={moment(this.state.birthday)} 
                      disabledDate={this.disabledDate} placeholder="出生日期" />)}
                    <div>{this.state.nowAge}岁</div>
                  </Form.Item>:this.state.nowAge+'岁'}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱" span={1.5}>{this.state.editStatus?
                  <Form.Item>
                    {getFieldDecorator("email",{
                      initialValue:this.state.email,
                      validateFirst: true,
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: "请输入邮箱"
                        },
                        {
                          validator:(rule, value, callback) => {
                             validEmail(value)?callback():callback('请输入正确的邮箱格式')
                          }
                        }
                      ]
                    })(<Input maxLength={20} placeholder="邮箱" />)}
                  </Form.Item>:this.state.email}
              </Descriptions.Item>
              <Descriptions.Item label="毕业院校" span={1.5} >{this.state.editStatus?
                  <Form.Item>
                    {getFieldDecorator("education",{
                      initialValue:this.state.education,
                      validateFirst: true,
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          max:20,
                          message: "请输入院校(最多20个字)"
                        },{
                          validator:(rule, value, callback) => {
                             !isSpecialSymbol(value)?callback():callback('院校不能包含符号')
                          }
                        }
                      ]
                    })(<Input maxLength={20} placeholder="院校" />)}
                  </Form.Item>:this.state.education}
              </Descriptions.Item>
              <Descriptions.Item label="职位"span={1.5}>{this.state.editStatus?
                  <Form.Item>
                    {getFieldDecorator("occupation",{
                      initialValue:this.state.occupation,
                      validateFirst: true,
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          max:20,
                          message: "请输入职位(最多20个字)"
                        },{
                          validator:(rule, value, callback) => {
                             !isSpecialSymbol(value)?callback():callback('职位不能包含符号')
                          }
                        }
                      ]
                    })(<Input maxLength={20} placeholder="职位" />)}
              </Form.Item>:this.state.occupation}
              </Descriptions.Item>
              <Descriptions.Item label="意向城市" span={1.5}>{this.state.editStatus?
              <Form.Item>
                {getFieldDecorator("intentionCity",{
                    initialValue:this.state.intentionCity,
                    rules: [
                      {
                        required: true,
                        message: "请选择城市"
                      }
                    ]
                })(<Select 
                  showSearch
                  style={{width:'285px'}}
                  placeholder={'选择或查找城市'}
                  filterOption={(input, option) =>
                    option.props.children.indexOf(input) >= 0
                  }>
                  {cityList.map(item=><Option key={item.id} value={item.city_name}>{item.city_name}</Option>)}
                </Select>)}
            </Form.Item>:this.state.intentionCity}
              </Descriptions.Item>
              <Descriptions.Item label="最快到岗时间" span={1.5}>{this.state.editStatus?
                  <div>
                    {getFieldDecorator("entryTime",{initialValue:this.state.entryTime})(<Select style={{width:'285px'}}>
                      <Option value={0}>随时</Option>
                      <Option value={1}>一周内</Option>
                      <Option value={2}>15天内</Option>
                      <Option value={3}>一个月</Option>
                    </Select>)}
                  </div>
                 :this.entryTimeList[parseInt(this.state.entryTime)]}
              </Descriptions.Item>
              <Descriptions.Item label="工作时间" span={1.5}>{this.state.editStatus?
                  <Form.Item className={styles['month-panel']}>
                    {getFieldDecorator("worktime",{
                      initialValue:moment(this.state.worktime),
                      rules: [
                        {
                          required: true,
                          message: "请选择参加工作日期"
                        }
                      ]
                    })( <MonthPicker 
                      className={styles['month-picker']}
                      onChange={this.dateChange}
                      defaultPickerValue={moment(this.state.worktime)} 
                      disabledDate={this.disabledDate} placeholder="参加工作日期" />)}
                    <div>{this.state.workYears}年工作经验</div>
                  </Form.Item>
                   :this.state.workYears+'年工作经验'}
              </Descriptions.Item>
              <Descriptions.Item label="求职意向" span={3} >{this.state.editStatus?
                  <Form.Item>
                    {getFieldDecorator("jobintention",{
                      initialValue:this.state.jobintention,
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          max:50,
                          message: "请输入求职意向(最多50个字)"
                        }
                      ]
                    })(<Input maxLength={50} placeholder="求职意向" />)}
                  </Form.Item>:this.state.jobintention}
              </Descriptions.Item>
              <Descriptions.Item label="技能特长" span={3}>{this.state.editStatus?
                <div>
                  {skillItem}
                  {keys.length<12?<Button type="dashed" onClick={this.addSkill} style={{ width: '49%' }}>
                    <Icon type="plus" /> 添加技能
                  </Button>:''}
                </div>
                 :<div>
                    {this.state.skills.map((key,index)=>
                        <Row key={"skilltext"+index}>
                          <Col span={6}>{key}</Col>
                          <Col span={6}>
                            <span style={{marginRight:'20px',fontWeight:'700'}}>技能熟练度:</span>
                            <span>{this.state.slider[index]>20?(this.state.slider[index]>50?(this.state.slider[index]>80?'精通':'熟练'):'熟悉'):'了解'}</span>
                          </Col>
                        </Row> 
                    )}
                   </div>}
              </Descriptions.Item>  
              <Descriptions.Item label="爱好" span={3}>{this.state.editStatus?
                  <Form.Item>
                    {getFieldDecorator("hobby",{
                      initialValue:this.state.hobby,
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          max:50,
                          message: "请输入爱好(最多50个字)"
                        }
                      ]
                    })(<Input maxLength={50} placeholder="爱好" />)}
                  </Form.Item>:this.state.hobby}
              </Descriptions.Item>
              <Descriptions.Item span={3} label="自我评价">{this.state.editStatus?
                  <Form.Item>
                    {getFieldDecorator("selfdescription",{
                      initialValue:this.state.selfdescription,
                      rules: [
                        {
                          required: true,
                          max:300,
                          message: "请输入自我评价"
                        }
                      ]
                    })(<TextArea placeholder="自我评价(最多输入300字)" maxLength={300} autoSize={{ minRows: 3, maxRows: 6 }}/>)}
                  </Form.Item>:this.state.selfdescription}
              </Descriptions.Item>
           
          </Descriptions>
          </Col>
        </Row>
        <Row gutter={16} className={styles['timeLine-panel']} >
          <Col span={12}>
            {this.state.editStatus?
              <div>
                <Timeline>
                  {jobexperienceItem}
                </Timeline>
                {timelines.length<12?<Button type="primary" onClick={this.addTimeLine}>
                  <Icon type="plus" /> 添加经历
                </Button>:''}
              </div>:<Timeline>
                    {this.state.experience.map((item,index)=>{
                      return <Timeline.Item key={"timetext"+index}>
                          {this.state.experiencetime[index]}
                          <br/>
                          {item}
                      </Timeline.Item>
                    })}
                </Timeline>}
          </Col>
        </Row>
        <BackTop className={styles['resume-backup']} visibilityHeight={200} />
      </div>
    );
  }
}
export default Resumeonline
