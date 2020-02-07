import React from 'react';
import { connect } from 'dva';
import { Form, Input } from 'antd';
@connect(state=>({
    errorFlag:state.appRePassword.errorFlag
  }),{
    rePasswordFn: payload => ({
        type: "appRePassword/rePasswordFn",payload
    }),
  })
@Form.create()
class ModifyPassword extends React.Component{
    state={
        confirmDirty: false,
        oldDirty:false
    }
    componentDidMount(){
        this.props.onRef(this);
    }
    //修改密码提交
    submitRePassword =  () =>{
        let {rePasswordFn,repasswordModel,form} = this.props;
        form.validateFields(async(err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let {oldpassword,newpassword} = values;
                await rePasswordFn({oldpassword,newpassword});
                repasswordModel(!!(this.props.errorFlag<0))
            }
        });
    }
    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    handleOldBlur = e => {
        const { value } = e.target;
        this.setState({ oldDirty: this.state.oldDirty || !!value });
    }
    //
    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.oldDirty) {
            form.validateFields(['oldpassword'], { force: true });
        }
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      };
    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('newpassword')) {
            callback('两次密码不同');
        } else {
            callback();
        }
    };
    compareNewPassword =  (rule, value, callback) => {
        const { form } = this.props;
        if (value && value === form.getFieldValue('newpassword')) {
            callback('新密码与旧密码相同');
        } else {
            callback();
        }
    };
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                span:24
            },
            wrapperCol: {
                span:24
            },
          };
        return (
            
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="旧密码" hasFeedback>
                {getFieldDecorator('oldpassword', {
                    rules: [
                    {
                        required: true,
                        message: '请输入旧密码',
                    },
                    {
                        validator: this.compareNewPassword,
                    },
                    ],
                })(<Input.Password onBlur={this.handleOldBlur}/>)}
                </Form.Item>
                <Form.Item label="新密码" hasFeedback>
                    {getFieldDecorator('newpassword', {
                        rules: [
                        {
                            required: true,
                            message: '请输入新密码',
                        },
                        {
                            validator: this.validateToNextPassword,
                        },
                        ],
                    })(<Input.Password />)}
                </Form.Item>
                <Form.Item label="确认密码" hasFeedback>
                    {getFieldDecorator('confirm', {
                        rules: [
                        {
                            required: true,
                            message: '请确认密码',
                        },
                        {
                            validator: this.compareToFirstPassword,
                        },
                        ],
                    })(<Input.Password onBlur={this.handleConfirmBlur}  />)}
                </Form.Item>
            </Form>
        )
    }
}
export default ModifyPassword