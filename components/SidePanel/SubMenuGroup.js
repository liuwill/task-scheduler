import React, { Component } from 'react' // eslint-disable-line
// import { Link } from 'react-router-dom'
// import Link from 'next/link'
import { Icon } from 'antd'

export default class SubMenuGroup extends Component {
  constructor (props) {
    super(props)
    const { location, prefix } = props

    let isOpen = true
    if (props.fold === true && !location.pathname.startsWith(`/${prefix}`)) {
      isOpen = false
    }

    this.state = {
      isOpen,
    }
  }

  handleClickSubTitle = () => {
    this.setState((prevState, props) => ({
      isOpen: !prevState.isOpen
    }))
  }

  render() {
    const { location, icon = 'bars', title = '', menuConfig = {}, prefix = '', isBlur = false } = this.props
    const { isOpen } = this.state

    Object.keys(menuConfig).forEach(key => {
      menuConfig[key].active = false
      if (!location) {
        return
      }

      if (!prefix && location.pathname.startsWith(`/${key}`)) {
        menuConfig[key].active = true
      } else if (prefix && location.pathname.startsWith(`/${prefix}/${key}`)) {
        menuConfig[key].active = true
      }

      if (isBlur && location.pathname.startsWith(`/${key}`)) {
        menuConfig[key].active = true
      }
    })

    const mainClasses = ['side-menu-group', 'side-submenu-group']

    if (isOpen) {
      mainClasses.push('open')
    }
    return (
      <div className={mainClasses.join(' ')}>
        <div className="side-menu-title" onClick={this.handleClickSubTitle}>
          <div className="side-submenu-title">
            <Icon type={icon} />
            <span>{title}</span>
          </div>
          <Icon type="down" className="side-submenu-arrow" />
        </div>
        <ul className="side-menu-list">
          {
            isOpen && Object.keys(menuConfig).map(key => {
              const menuData = menuConfig[key]
              let clsName = 'side-menu-item'
              if (menuData.active === true) {
                clsName += ' active'
              }
              return <li className={clsName} key={key}>
                <a className="item-link"><Icon type={menuData.icon} />{menuData.title}</a>
              </li>
            })
          }
        </ul>
      </div>
    )
  }
}
