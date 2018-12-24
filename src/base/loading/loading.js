/**
 * Created by qlb
 */
import React, { Component } from 'react'
import './loading.less'

export default class extends Component {
  render() {
    if (this.props.isLoading) {
      return (
        <div className="loading-wrapper">
          <div className="loading">
            <div className="loading-img" />
            <p className="desc">{this.props.title}</p>
          </div>
        </div>
      )
    } else {
      return ''
    }
  }
}
