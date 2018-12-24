/**
 * Created by qlb
 */
import React, { Component } from 'react'
// import { lazyload } from 'react-lazyload';
// import LazyLoad from 'react-lazyload';
import './book.less'

// lazyload({
//   placeholder: require('./images/book-default.png')
// })
export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <li className="pic-item" onClick={this.bookClick.bind(this)}>
        <div className="img-box">
          {this.props.book.score !== '' ? <div className="score">{this.props.book.score}分</div> : ''}
          <img src={this.props.book.image} alt="" />
          <div className="pic-type">
            {this.props.book.topics.map((topic, topicIndex) => {
              return `${topicIndex === 0 ? '' : '/'}${topic.topicName}`
            })}
          </div>
        </div>
        <div className="text">{this.props.book.bookName}</div>
      </li>
    )
  }
  bookClick() {
    this.props.bookClick()
  }
}
