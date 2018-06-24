import React from 'react' // eslint-disable-line
import { withRouter } from 'next/router'
// import '../styles/common.scss'
import '../styles/login.scss'

import { Form, Input, message, Button, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

class Login extends React.Component {
  static async getInitialProps ({ req }) {
    return req
      ? { userAgent: req.headers['user-agent'] }
      : { userAgent: navigator.userAgent }
  }

  handleLogin = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('Login Error')
        return
      }

      message.success('Just Login')
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const hostConfig = {
      local: {
        title: '本机'
      }
    }
    return (
      <Form onSubmit={this.handleLogin} className="login-form login-main">
        <div className="top-bar">
          <a className="site-avatar slim" href="/">
            <span className="name-logo">Cronus</span>
          </a>
        </div>
        <div className="login-container">
          <div className="login-panel">
            <div className="login-title">登录系统</div>
            <div className="login-form">
              <FormItem className="vp-form-item">
                {getFieldDecorator('host', {
                  rules: [{ required: true, message: '选择一个主机' }],
                })(
                  <Select placeholder="选择主机" className="vp-select form-control">
                    {
                      Object.keys(hostConfig).map(key => {
                        const hostItem = hostConfig[key]
                        return <Option key={key} value={key}>{hostItem.title}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>

              <FormItem className="vp-form-item">
                {getFieldDecorator('mail', {
                  rules: [{
                    type: 'email', message: '请填入正确的邮箱格式!',
                  }, { required: true, message: '未填写正确的邮箱' }],
                })(
                  <Input type="text" className="vp-input form-control" placeholder="邮箱" />
                )}
              </FormItem>

              <FormItem className="vp-form-item">
                {getFieldDecorator('secret', {
                  rules: [{ required: true, message: '未填写密码' }],
                })(
                  <Input type="password" className="vp-input form-control" placeholder="密码" />
                )}
              </FormItem>

              <FormItem className="vp-form-item last">
                <Button key="submit" htmlType="submit" className="login-btn" type="primary" >登录</Button>
              </FormItem>
            </div>
            <div className="cutting-line">
              有问题？<a href="mailto:liuwill@live.com">联系开发人员</a>
            </div>
          </div>
        </div>
      </Form>)
  }
}

const LoginForm = Form.create()(Login)
export default withRouter(LoginForm)
