import React from 'react';
import { connect } from 'dva';
import { Form, Input, Select,Row, Col, Button, Icon } from 'antd';
import cityList from '../../utils/cityList'
const { Option } = Select;
let teamId = 0;
@connect(state=>({}),{
    updatePersonalInfoFn: payload => ({
        type: "appPersonal/updatePersonalInfoFn",payload
    }),
  })
@Form.create()
class ModifyPersonal extends React.Component{
    state={
      team: !!JSON.parse(window.localStorage.getItem('userinfo')).team ?JSON.parse(window.localStorage.getItem('userinfo')).team.split(',') :''
    }
    componentDidMount(){
        this.props.onRef(this);
    }
    //提交修改
    submitPersonal = () =>{
        let { form, updatePersonalInfoFn } = this.props;
        form.validateFields(async(err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const {nickname, sign, occupation, company, location, team} = values;
                const teams = team.filter(item=> !!item);
                console.log(teams);
                // await updatePersonalInfoFn({payload:{ nickname, sign, occupation, company, location, team }});
            }
        });
    }
    //添加team
    addTeam = () =>{
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(teamId++);
      form.setFieldsValue({
        keys: nextKeys,
      });
    }
    //取消team
    removeTeam = key =>{
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      form.setFieldsValue({
        keys: keys.filter(k => k !== key),
      });
    }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                span:24
            },
            wrapperCol: {
                span:24
            },
          };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const teamItem = keys.map((k, index) => (
          <Row key={k}>
            <Col span={22}>
              <Form.Item>
                {getFieldDecorator(`team[${k}]`, {
                  initialValue:this.state.team[index]})
                  (<Input placeholder="请输入团队"/>)}
              </Form.Item>
            </Col>
            <Col span={2} style={{fontSize:'18px'}}>
              <div style={{float:'right'}} onClick={() =>{this.removeTeam(k)}}><Icon type="minus-circle" /></div>
            </Col>
          </Row>
        ));
        return (
            <Form {...formItemLayout}>
                <Form.Item label="昵称">
                {getFieldDecorator('nickname', {
                    initialValue:JSON.parse(window.localStorage.getItem('userinfo')).nickname,
                    rules: [{
                            required: true,
                            message: '请输入昵称',
                        },{
                            max: 10,
                            message: '昵称最多10个字',
                        }]
                })(<Input placeholder="请输入昵称"/>)}
                </Form.Item>
                <Form.Item label="签名">
                    {getFieldDecorator('sign', {
                        initialValue:JSON.parse(window.localStorage.getItem('userinfo')).sign,
                        rules: [{
                                max: 50,
                                message: '签名最多50个字',
                            }]
                    })(<Input placeholder="请输入签名"/>)}
                </Form.Item>
                <Form.Item label="职位">
                {getFieldDecorator('occupation', {
                    initialValue:JSON.parse(window.localStorage.getItem('userinfo')).occupation,
                    rules: [{
                            max: 50,
                            message: '职位最多50个字',
                        }]
                })(<Input placeholder="请输入职位"/>)}
                </Form.Item>
                <Form.Item label="公司部门">
                    {getFieldDecorator('company', {
                        initialValue:JSON.parse(window.localStorage.getItem('userinfo')).company,
                        rules: [{
                                max: 60,
                                message: '公司部门最多60个字',
                            }]
                    })(<Input placeholder="请输入公司部门"/>)}
                </Form.Item>
                  <Form.Item label="所在城市">
                    {getFieldDecorator("location",{
                        initialValue:JSON.parse(window.localStorage.getItem('userinfo')).location,
                    })(<Select 
                      showSearch
                      placeholder={'选择或查找城市'}
                      filterOption={(input, option) =>
                        option.props.children.indexOf(input) >= 0
                      }>
                      {cityList.map(item=><Option key={item.id} value={item.city_name}>{item.city_name}</Option>)}
                    </Select>)}
                </Form.Item>
                <Form.Item label="团队">
                    {teamItem}
                    {keys.length < 4?<Button  type="dashed" onClick={this.addTeam} style={{ width: '49%' }}>
                      <Icon type="plus" /> 添加团队
                    </Button>:''}
                </Form.Item>
            </Form>
        )
    }
}
export default ModifyPersonal