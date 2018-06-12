import React, { Component } from 'react'

export default class Layout extends Component {

  render() {
    const { className, children } = this.props
    return (
      <div className="main-layout">
        { children }
      </div>
    )
  }
}