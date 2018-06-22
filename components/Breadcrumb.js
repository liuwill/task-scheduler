import React, { Component } from 'react' // eslint-disable-line
import { Breadcrumb as AntdBreadcrumb, Icon } from 'antd'

export default class Breadcrumb extends Component {

  render() {
    return (
      <AntdBreadcrumb>
        <AntdBreadcrumb.Item href="">
          <Icon type="schedule" />
        </AntdBreadcrumb.Item>
        <AntdBreadcrumb.Item href="">
          <Icon type="clock-circle-o" />
          <span>任务管理</span>
        </AntdBreadcrumb.Item>
      </AntdBreadcrumb>
    )
  }
}
