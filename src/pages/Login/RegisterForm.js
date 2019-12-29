import React from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import { calculateWidth } from '../../utils/utils'
import TipBox from '../../components/TipBox'
const styles = {
  focus: {
    width: '20px',
    opacity: 1
  },
}
@connect()
@Form.create()
class AppRegisterForm extends React.Component {
  state = {
    focusItem: -1
  }
  componentDidMount () {
  }
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
        focusItem: -1
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.invitation.length !== 5) {
          this.props.form.setFields({
            invitation: {
              value: values.invitation,
              errors: [new Error('邀请码错误')]
            }
          })
          return
        }
        //再次手动校验，防止确认密码为空
        if(values.confirmPassword !== values.registerPassword){
            this.props.form.setFields({
                confirmPassword: {
                  value: values.confirmPassword,
                  errors: [new Error('请确认密码')]
                }
              })
              return
        }
        console.log('values of form: ', values);
        this.props.dispatch({type:"appRegister/registerFn",registerInfo:{...values,formObj:this.props.form}})
      }
    });
  };
  //登录
  gobackLogin = () => {
    this.props.switchShowBox('login')
    setTimeout(() => this.props.form.resetFields(), 500)
  }
  render() {
    const { getFieldDecorator, getFieldError, getFieldValue } = this.props.form;
    const { focusItem } = this.state;
    return (
      <div className={this.props.className}>
        <h3 className='title'>后台管理系统注册</h3>
        <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item 
                help={getFieldError('registerUsername') && <TipBox info={getFieldError('registerUsername')} width={calculateWidth(getFieldError('registerUsername'))}></TipBox>}
              >
                {getFieldDecorator('registerUsername', {
                    validateFirst: true,
                    rules: [
                        { required: true, message: '请输入用户名' },
                        {pattern: '^[^ ]+$', message: '用户名不能有空格'}
                    ]
                })(
                  <Input
                    onFocus={() => this.setState({focusItem: 0})}
                    onBlur={() => this.setState({focusItem: -1})}
                    autoComplete="off"
                    maxLength={16}
                    placeholder="用户名"
                    addonBefore={<span className='iconfont icon-user' style={focusItem === 0 ? styles.focus : {}}/>}
                  />,
                )}
              </Form.Item>
              <Form.Item
                help={getFieldError('registerPassword') && <TipBox info={getFieldError('registerPassword')} width={calculateWidth(getFieldError('registerPassword'))}></TipBox>}
              >
                {getFieldDecorator('registerPassword', {
                    validateFirst: true,
                    rules: [
                        {required: true, message: '请输入密码' },
                        {pattern: '^[^ ]+$', message: '密码不能有空格'}
                    ]
                })(
                  <Input
                    onFocus={() => this.setState({focusItem: 1})}
                    onBlur={() => this.setState({focusItem: -1})}
                    maxLength={16}
                    type="password"
                    placeholder="密码"
                    addonBefore={<span className='iconfont icon-password' style={focusItem === 1 ? styles.focus : {}}/>}
                  />,
                )}
              </Form.Item>
              <Form.Item
                help={getFieldError('confirmPassword') && <TipBox info={getFieldError('confirmPassword')} width={calculateWidth(getFieldError('confirmPassword'))}></TipBox>}
              >
                {getFieldDecorator('confirmPassword', {
                    rules: [
                        {
                        validator: (rule, value, callback) => {
                        if (value && value !== getFieldValue('registerPassword')) {
                            callback('两次输入不一致！')
                        }
                        callback()
                        }
                    }]
                })(
                  <Input
                    onFocus={() => this.setState({focusItem: 2})}
                    onBlur={() => this.setState({focusItem: -1})}
                    maxLength={16}
                    type="password"
                    placeholder="确认密码"
                    addonBefore={<span className='iconfont icon-password' style={focusItem === 2 ? styles.focus : {}}/>}
                  />,
                )}
              </Form.Item>
              <Form.Item
                help={getFieldError('invitation') && <TipBox info={getFieldError('invitation')} width={calculateWidth(getFieldError('invitation'))}></TipBox>}
              >
                {getFieldDecorator('invitation', {
                  rules: [{required: true, message: '请输入邀请码'}]
                })(
                      <Input
                        onFocus={() => this.setState({focusItem: 3})}
                        onBlur={() => this.setState({focusItem: -1})}
                        autoComplete="off"
                        maxLength={5}
                        placeholder='邀请码'
                        addonBefore={<span className='iconfont icon-vercode'
                                          style={focusItem === 3 ? styles.focus : {}}/>}/>
                )}
              </Form.Item>
              <div className="btn-bottom">
                <input className='loginBtn' type="submit" value='注册'/>
                <span className='registerBtn' onClick={this.gobackLogin}>去登录</span>
              </div>
            </Form>
      </div>
    );
  }
}
export default AppRegisterForm