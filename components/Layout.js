import React, { Component } from 'react' // eslint-disable-line

export default class Layout extends Component {

  render() {
    const { className, children } = this.props

    let layoutCls = `main-layout ${className}`
    return (
      <div className={layoutCls}>
        { children }
      </div>
    )
  }
}
