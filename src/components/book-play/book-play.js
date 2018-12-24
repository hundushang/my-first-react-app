import React, { Component } from 'react'
import Article from './article/article'
import Words from './words/words'
import Tips from './tips/tips'
import Loading from '../../base/loading/loading'
import BScroll from 'better-scroll'
import PropTypes from 'prop-types'
import { pbSubmitRead } from '../../api/index'
import { saveStorageData, loadStorageData } from '../../assets/js/util'
import './book-play.less'

export default class extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      // 显示原文翻译
      isArticleShow: false,
      text: '',
      explanation: '',
      // 显示单词表
      isWordsShow: false,
      // 显示开始提示
      isTipsShow: false,
      // 显示去答题
      isGoAnswerShow: false,
      // 显示下一页提示
      isNextTipsShow: false,
      // 当前页码
      currentPageIndex: 0,
      // 0--未播放 1--播放中 2--播放完 3--暂停
      playingType: 0,
      // 看绘本时间
      usedTime: 0,
      isSubmit: false,
      count: 0,
      isLoading: true
    }
  }
  render() {
    return (
      <div className="bookplay-wrapper">
        <div className="bookplay-head">
          <i className="icon-back" onClick={this.props.back} />
          <span className="flex-fill" />
          <span className="btn-article" onClick={this.showArticle.bind(this)}>
            原文/翻译
          </span>
          <span className="btn-word" onClick={this.showWords.bind(this)}>
            生词
          </span>
        </div>
        <div className="img-box-wrapper" ref="slider">
          <div className="slider-group" ref="sliderGroup">
            {this.props.bookPages.map((item, index) => {
              return (
                <div className="slider-item" key={`bookPage${index}`}>
                  <img className={item.audioLength === -1 ? 'default' : ''} src={item.image} alt={item.explanation} onLoad={this.imgOnLoad.bind(this)} onError={this.imgOnLoad.bind(this, item)} />
                </div>
              )
            })}
          </div>
        </div>
        <div className="pic-operation">
          <audio ref="audio" onPlay={this.onPlay.bind(this)} onEnded={this.onEnded.bind(this)} />
          <div className={`btn-play${this.state.playingType === 1 ? ' pause' : ''}${this.state.playingType === 2 ? ' replay' : ''}`} onClick={this.playAudio.bind(this)} />
          <span className="flex-fill" />
          {this.state.isGoAnswerShow || this.props.readFlag === '1' ? (
            <div className={`btn-goanswer${this.state.isGoAnswerShow ? ' gelatine' : ''}`} onClick={this.goAnswer.bind(this)}>
              去答题
            </div>
          ) : (
            ''
          )}
          <span className="flex-fill" />
          <div className="page-text">
            <span className="current">{this.state.currentPageIndex + 1}/</span>
            {this.props.bookPages.length}
          </div>
        </div>
        {this.state.playingType === 2 ? (
          <div className="again-tips" onClick={this.playAudio.bind(this)}>
            再读一遍
          </div>
        ) : (
          ''
        )}
        {/* {this.state.isNextTipsShow ? <div className="next-tips">3秒后播放下一页</div> : ''} */}
        {this.state.isArticleShow ? <Article back={this.hideArticle.bind(this)} text={this.state.text} explanation={this.state.explanation} /> : ''}
        {this.state.isWordsShow ? <Words back={this.hideWords.bind(this)} /> : ''}
        {this.state.isTipsShow ? <Tips close={this.closeTips.bind(this)} /> : ''}
        <Loading isLoading={this.state.isLoading} />
      </div>
    )
  }
  componentDidMount() {
    // 左右滑动提示
    const tipsShow = loadStorageData('tipsShow')
    if (!tipsShow) {
      this.setState(
        {
          isTipsShow: !tipsShow
        },
        () => {
          saveStorageData('tipsShow', 1)
        }
      )
    }
    this._setSliderWidth()
    this._initDots()
    this._initSlider()
    // 定时器开跑
    this._runTimer()
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }
  _runTimer() {
    this.timer = setTimeout(() => {
      this.setState(
        {
          usedTime: this.state.usedTime + 1
        },
        () => {
          this._runTimer()
        }
      )
    }, 1000)
  }
  imgOnLoad(item) {
    this.setState(
      {
        count: this.state.count + 1
      },
      () => {
        if (this.state.count >= this.props.bookPages.length) {
          this.setState({ isLoading: false })
        }
      }
    )
    if (item) {
      item.image = require('./images/default.png')
      item.audioLength = -1
    }
  }
  // _getPbBook() {
  //   let params = {
  //     studentUserId: sessionStorage.studentUserId,
  //     bookId: sessionStorage.bookId
  //   }
  //   getPbBook(params).then(res => {
  //     this.setState({
  //       bookPages: res.bookPages
  //     })
  //   })
  // }
  _setSliderWidth() {
    this.children = this.refs.sliderGroup.children

    let width = 0
    let sliderWidth = this.refs.slider.clientWidth
    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i]
      child.style.width = sliderWidth + 'px'
      width += sliderWidth
    }
    this.refs.sliderGroup.style.width = width + 'px'
  }
  _initSlider() {
    this.slider = new BScroll(this.refs.slider, {
      scrollX: true,
      scrollY: false,
      momentum: false,
      click: true,
      snap: {
        loop: this.state.loop,
        threshold: 0.3,
        speed: 400
      }
    })
    this.slider.on('scrollEnd', this._onScrollEnd.bind(this))

    this.slider.on('touchend', () => {
      if (this.state.autoPlay) {
        this._play()
      }
    })

    this.slider.on('beforeScrollStart', () => {
      this.setState({
        isNextTipsShow: false
      })
      clearTimeout(this.timer)
    })
  }
  _onScrollEnd() {
    let pageIndex = this.slider.getCurrentPage().pageX
    if (pageIndex !== this.state.currentPageIndex) {
      this.setState(
        {
          playingType: 0,
          currentPageIndex: pageIndex
        },
        this.playAudio.bind(this)
      )
    }
    if (this.state.autoPlay) {
      this._play()
    }
  }
  _initDots() {
    this.dots = new Array(this.children.length)
  }
  _play() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.setState({
        isNextTipsShow: false
      })
      this.slider.next()
    }, 3000)
  }
  // 播放音频
  playAudio() {
    // 首次播放
    if (this.state.playingType === 0) {
      this.refs.audio.src = this.props.bookPages[this.state.currentPageIndex].audio
      this.refs.audio.play()
    } else if (this.state.playingType === 2 || this.state.playingType === 3) {
      // 播放完或者暂停
      this.refs.audio.play()
    } else {
      // 暂停
      this.setState({
        playingType: 3
      })
      this.refs.audio.pause()
    }
  }
  onPlay() {
    this.setState({
      playingType: 1
    })
  }
  onEnded() {
    this.setState({
      playingType: 2
    })
    if (this.state.currentPageIndex < this.props.bookPages.length - 1) {
      this.setState(
        {
          isNextTipsShow: true
        },
        () => {
          this._play()
        }
      )
    } else {
      this._pbSubmitRead()
      this.setState({
        isGoAnswerShow: true
      })
    }
  }
  // 学生完成阅读提交
  _pbSubmitRead() {
    if (this.state.isSubmit) {
      return
    }
    this.setState({
      isSubmit: true
    })
    let params = {
      studentUserId: sessionStorage.studentUserId,
      bookId: sessionStorage.bookId,
      usedTime: this.state.usedTime
    }
    pbSubmitRead(params).then(res => {})
  }
  // 去答题
  goAnswer() {
    this.props.goAnswer()
    // this.context.router.history.push('/answer')
  }
  // 显示原文翻译
  showArticle() {
    this.setState({
      isArticleShow: true,
      text: this.props.bookPages[this.state.currentPageIndex].text,
      explanation: this.props.bookPages[this.state.currentPageIndex].explanation
    })
    this.refs.audio.pause()
  }
  hideArticle() {
    this.setState({
      isArticleShow: false
    })
    this.refs.audio.play()
  }
  // 显示生词
  showWords() {
    this.setState({
      isWordsShow: true
    })
    this.refs.audio.pause()
  }
  hideWords() {
    this.setState({
      isWordsShow: false
    })
    this.refs.audio.play()
  }
  closeTips() {
    this.setState({
      isTipsShow: false
    })
  }
}
