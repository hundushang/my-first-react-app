/**
 * Created by qlb
 */
import React, { Component } from 'react'
import './nav-select.less'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false
    }
  }
  componentDidMount() {
    this.props.getNavSelect(this)
  }
  render() {
    return (
      <div className={`nav-select-wrapper${this.state.isShow?'':' none'}`} onClick={this.hide.bind(this)}>
        <div className="nav-select-box" onClick={e => this.handleStop(e)}>
          {this.props.list.map((item, index) => {
            return (
              <div className={`select-item${this.props.currentItem === item ? ' current' : ''}`} key={index} onClick={this.selectItem.bind(this, item)}>
                {item.text}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  selectItem(item) {
    this.hide()
    this.props.selectItem(item)
  }
  handleStop(e) {
    e.stopPropagation()
    // e.nativeEvent.stopImmediatePropagation()
  }
  show() {
    this.setState({
      isShow: true
    })
  }
  hide() {
    this.setState({
      isShow: false
    })
  }
}
