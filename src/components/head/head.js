/**
 * Created by qlb
 */
import React, { Component } from 'react'
import './head.less'

export default class extends Component {
  render() {
    return (
      <div className="header-wrapper">
        <div className="headerBack" onClick={this.props.back}>
          <i className="icon-arrow_lift" />
        </div>
        <div className="headerTitle">{this.props.title}</div>
        {this.props.children}
      </div>
    )
  }

  // handleBack() {
  //     window.history.back();
  // }
}
