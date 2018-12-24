import React, { Component } from 'react'
import './tips.less'

export default class extends Component {
  render() {
    return (
      <div className="article-tips-wrapper" onClick={this.props.close}>
        <div className="img-wrapper">
          <div className="icon-wrapper">
            <div className="icon-1" />
            <div className="icon-2" />
            <div className="icon-3" />
          </div>
          <div className="text-img" />
        </div>
      </div>
    )
  }
}
