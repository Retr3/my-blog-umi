import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import { connect } from 'dva';
import { randomNum, calculateWidth } from '../../utils/utils'
import TipBox from '../../components/TipBox'
const styles = {
  focus: {
    width: '20px',
    opacity: 1
  },
}
@connect(state=>({isLogin: !!state.appLogin.userid}))
@Form.create()
class AppLoginForm extends React.Component {
  state = {
    focusItem: -1,   //保存当前聚焦的input
    code: ''         //验证码
  }
  componentDidMount () {
    this.createCode()
  }
  /**
   * 生成验证码
   */
  createCode = () => {
    const ctx = this.canvas.getContext('2d')
    const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let code = ''
    ctx.clearRect(0, 0, 80, 39)
    for (let i = 0; i < 4; i++) {
      const char = chars[randomNum(0, 57)]
      code += char
      ctx.font = randomNum(20, 25) + 'px SimHei'  //设置字体随机大小
      ctx.fillStyle = '#D3D7F7'
      ctx.textBaseline = 'middle'
      ctx.shadowOffsetX = randomNum(-3, 3)
      ctx.shadowOffsetY = randomNum(-3, 3)
      ctx.shadowBlur = randomNum(-3, 3)
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      let x = 80 / 5 * (i + 1)
      let y = 39 / 2
      let deg = randomNum(-25, 25)
      /**设置旋转角度和坐标原点**/
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(char, 0, 0)
      /**恢复旋转角度和坐标原点**/
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    }
    this.setState({
      code
    })
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 表单登录时，若验证码长度小于4则不会验证，所以我们这里要手动验证一次
        if (this.state.code.toUpperCase() !== values.verification.toUpperCase()) {
          this.props.form.setFields({
            verification: {
              value: values.verification,
              errors: [new Error('验证码错误')]
            }
          })
          return
        }
        let redirect = (!!this.props.redirpath?this.props.redirpath:'/index');
        console.log('Received values of form: ', redirect);
        this.props.dispatch({type:"appLogin/login",payload:{...values,redirect,formObj:this.props.form}});
      }
    });
  };
  //注册
  register = () => {
    this.props.switchShowBox('register')
    setTimeout(() => this.props.form.resetFields(), 500)
  }
  render() {
    const { getFieldDecorator,getFieldError } = this.props.form;
    const { focusItem,code } = this.state;
    return (
      <div className={this.props.className}>
        <h3 className='title'>后台管理系统登录</h3>
        <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item 
                help={getFieldError('username') && <TipBox info={getFieldError('username')} width={calculateWidth(getFieldError('username'))}></TipBox>}
              >
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入用户名' }],
                })(
                  <Input
                    onFocus={() => this.setState({focusItem: 0})}
                    onBlur={() => this.setState({focusItem: -1})}
                    maxLength={16}
                    placeholder="用户名"
                    addonBefore={<span className='iconfont icon-user' style={focusItem === 0 ? styles.focus : {}}/>}
                  />,
                )}
              </Form.Item>
              <Form.Item
                help={getFieldError('password') && <TipBox info={getFieldError('password')} width={calculateWidth(getFieldError('password'))}></TipBox>}
              >
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }]
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
                help={getFieldError('verification') && <TipBox info={getFieldError('verification')} width={calculateWidth(getFieldError('verification'))}></TipBox>}
              >
                {getFieldDecorator('verification', {
                  validateFirst: true,
                  rules: [
                    {required: true, message: '请输入验证码'},
                    {
                      validator: (rule, value, callback) => {
                        if (value.length >= 4 && code.toUpperCase() !== value.toUpperCase()) {
                          callback('验证码错误')
                        }
                        callback()
                      }
                    }
                  ]
                })(
                  <Row className="code-style">
                    <Col span={15}>
                      <Input
                        onFocus={() => this.setState({focusItem: 2})}
                        onBlur={() => this.setState({focusItem: -1})}
                        maxLength={4}
                        placeholder='验证码'
                        addonBefore={<span className='iconfont icon-vercode'
                                          style={focusItem === 2 ? styles.focus : {}}/>}/>
                    </Col>
                    <Col span={9}>
                      <canvas onClick={this.createCode} width="80" height='39' ref={el => this.canvas = el}/>
                    </Col>
                  </Row>
                )}
              </Form.Item>
              <div className="btn-bottom">
                <input className='loginBtn' type="submit" value='登录'/>
                <span className='registerBtn' onClick={this.register}>注册</span>
              </div>
            </Form>
      </div>
    );
  }
}
export default AppLoginForm