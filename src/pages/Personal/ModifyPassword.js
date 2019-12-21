import React from 'react';
import { connect } from 'dva';
import { Form, Input, Tooltip, Icon, Cascader, Row, Col, AutoComplete } from 'antd';
@connect()
@Form.create()
class ModifyPassword extends React.Component{
    state={
        confirmDirty: false
    }
    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    //
    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
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
                        validator: this.validateToNextPassword,
                    },
                    ],
                })(<Input.Password />)}
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