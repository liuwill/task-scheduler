import React, { Component } from 'react' // eslint-disable-line
import { Breadcrumb as AntdBreadcrumb, Icon } from 'antd'

const RenderBreadItem = (props) => {
  const { item } = props
  if (item && item.link) {
    return (
      <a to={item.link}>
        <Icon type={item.icon} />
        <span> {item.title}</span>
      </a>
    )
  }
  return (
    <span>
      <Icon type={item.icon} />
      <span> {item.title}</span>
    </span>
  )
}

export default class Breadcrumb extends Component {

  render() {
    const { icon, title, link, subItems } = this.props

    return (
      <AntdBreadcrumb>
        <AntdBreadcrumb.Item href="/">
          <Icon type="home" />
        </AntdBreadcrumb.Item>
        <AntdBreadcrumb.Item>
          <RenderBreadItem item={{ icon, title, link }}/>
        </AntdBreadcrumb.Item>
        {subItems && subItems.map((item, index) => (
          <AntdBreadcrumb.Item key={index}><RenderBreadItem item={item}/></AntdBreadcrumb.Item>
        ))}
      </AntdBreadcrumb>
    )
  }
}
