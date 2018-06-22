import React, { Component } from 'react' // eslint-disable-line
import { Icon } from 'antd'

export default class SidePanel extends Component {
  state = {
    mode: 'inline',
    theme: 'light',
  }

  changeMode = (value) => {
    this.setState({
      mode: value ? 'vertical' : 'inline',
    })
  }

  changeTheme = (value) => {
    this.setState({
      theme: value ? 'dark' : 'light',
    })
  }

  render() {
    return (
      <div className="side-panel">
        <div className="side-title">
          <span className="title-text"><span className="text">Task Monitor</span></span>
        </div>

        <div className="side-menu">
          <div className="side-menu-group">
            <div className="side-menu-title">运维辅助</div>
            <ul className="side-menu-list">
              <li className="side-menu-item">
                <a className="item-link"><Icon type="calendar" />定时任务</a>
              </li>
            </ul>
          </div>

          {/* <div className="side-menu-group">
            <div className="side-menu-title">数据运维</div>
            <ul className="side-menu-list">
              <li className="side-menu-item">
                <a className="item-link"><Icon type="gift" /></a>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    )
  }
}
