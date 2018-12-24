import React, { Component } from 'react'
import { loadStorageData } from '../../assets/js/util'
import './new-word.less'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: -1,
      bookWords: loadStorageData('bookWords') || [],
      loop: false
    }
  }
  render() {
    return (
      <ul className="newword-wrapper border-1px">
        {this.state.bookWords.map((item, index) => {
          return (
            <li className={`word-item border-1px${this.state.currentIndex === index ? ' current' : ''}`} key={`words${index}`} onClick={this.play.bind(this, index, false)}>
              <div className="text-box">
                <p className="word">{item.text}</p>
                <p className="explanation">{item.explanation}</p>
              </div>
              <div className="icon-audio" />
            </li>
          )
        })}
        <audio ref="audio" onEnded={this.onEnded.bind(this)} onError={this.onError.bind(this)} />
      </ul>
    )
  }
  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this)
    }
  }
  play(index, loop) {
    // 本来是连续播放，又点击单个
    if (this.state.loop && !loop) {
      this.props.onEnded()
    }
    this.setState({
      currentIndex: index,
      loop: loop
    })
    this.refs.audio.src = this.state.bookWords[index].audio
    this.refs.audio.play()
  }
  onEnded() {
    // 连续播放
    if (this.state.loop) {
      if (this.state.currentIndex < this.state.bookWords.length - 1) {
        this.play(this.state.currentIndex + 1, true)
        this.setState({
          currentIndex: this.state.currentIndex + 1
        })
      } else {
        this.setState({
          currentIndex: -1
        })
        this.props.onEnded()
      }
    } else {
      this.setState({
        currentIndex: -1
      })
    }
  }
  onError() {
    window.layer.open({
      content: '找不到该音频',
      skin: 'msg',
      time: 2
    })
    this.setState({
      currentIndex: -1
    })
  }
  autoPlay() {
    if (!this.props.isPlaying) {
      this.setState(
        {
          currentIndex: 0
        },
        () => {
          this.play(0, true)
        }
      )
    } else {
      this.refs.audio.pause()
      this.props.onEnded()
      this.setState({
        currentIndex: -1
      })
    }
  }
}
