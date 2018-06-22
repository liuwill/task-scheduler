import React, { Component } from 'react' // eslint-disable-line
import SubMenuGroup from './SubMenuGroup'

export default class OpsMenuGroup extends Component {
  render() {
    const { location } = this.props
    const menuConfig = {
      console: {
        path: '/',
        icon: 'calendar',
        title: '任务管理',
      },
    }

    return (
      <SubMenuGroup menuConfig={menuConfig} location={location} prefix="task" title="定时任务" icon="layout" />
    )
  }
}
