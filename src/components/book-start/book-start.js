import React, { Component } from 'react'
// import CSSTransitionGroup from 'react-addons-css-transition-group';
import Head from '../head/head'
// 单词表
import NewWord from '../new-word/new-word'
// 播放绘本
import BookPlay from '../book-play/book-play'
import { getPbBook } from '../../api/index'
import { saveStorageData } from '../../assets/js/util'
import Loading from '../../base/loading/loading'
import './book-start.less'

export default class extends Component {
  constructor() {
    super()
    this.state = {
      // 0--绘本，1--单词表
      type: 0,
      isBookPlayShow: false,
      bookId: sessionStorage.bookId,
      bookPages: [],
      bookWords: [],
      image: '',
      // 词汇量
      vocabularyNum: 0,
      topics: [],
      // 是否读完
      readFlag: '0',
      // 是否答完题目
      answerFlag: '0',
      // 分数
      score: 0,
      // 错题数量
      errorCnt: 0,
      // 习题数量
      bookQuestionCnt: 0,
      // 是否在连续播放
      isPlaying: false,
      isLoading: false
    }
  }
  componentDidMount() {
    this._getPbBook()
  }
  render() {
    return (
      <div className="bookstart-wrapper">
        <Head title="" back={this.back.bind(this)}>
          <div className="nav-wrapper">
            <div className={`nav-item${this.state.type ? '' : ' current'}`} onClick={this.changeType.bind(this, 0)}>
              绘本
            </div>
            <div className={`nav-item${!this.state.type ? '' : ' current'}`} onClick={this.changeType.bind(this, 1)}>
              生词表
            </div>
          </div>
        </Head>
        {!this.state.type ? (
          <div className="book-box-wrapper">
            <div className="book-box">
              <div className="book-center">
                <div className="fill-wrapper" />
                <div className="book-img" onClick={this.showBookPlay.bind(this)}>
                  <div className="block-wrapper">
                    <div className="bookleft" />
                    <div className="tips">{this.state.gradeTermStr}</div>
                    <img className="img" src={this.state.image} alt="" />
                  </div>
                </div>
                <p className="text">{this.state.bookName}</p>
                <div className="desc">
                  <span className="text-box number">
                    <span className="text-1">{this.state.vocabularyNum}词</span>
                  </span>
                  {this.state.topics.map((topic, topicIndex) => {
                    return (
                      <span className="text-box topic" key={`topic${topicIndex}`}>
                        <span className="text-1">{topic.topicName}</span>
                      </span>
                    )
                  })}
                </div>
                {this.state.answerFlag === '1' ? (
                  <div className="score-wrapper">
                    <div className="score-box" onClick={this.goResult.bind(this)}>
                      <p className="number">{this.state.score}</p>
                      <p className="score-text">成绩</p>
                    </div>
                    <div className="score-box" onClick={this.goResult.bind(this)}>
                      {this.state.errorCnt > 0 ? (
                        <p className="number wrong">
                          <b>{this.state.errorCnt}</b>/{this.state.bookQuestionCnt}
                        </p>
                      ) : (
                        <p className="number">0</p>
                      )}

                      <p className="score-text">错题</p>
                    </div>
                  </div>
                ) : (
                  ''
                )}
                <div className="fill-wrapper" />
              </div>
            </div>
            <div className="btn-wrapper">
              <div className="btn-box">
                <div className="btn btn-play" onClick={this.showBookPlay.bind(this)} />
                <div className="text">点击阅读</div>
              </div>
              <div className="btn-box" onClick={this.goAnswer.bind(this)}>
                <div className={`btn btn-do${this.state.readFlag === '1' ? '' : ' disabled'}`} />
                {this.state.readFlag === '1' ? <div className="text">开始练习</div> : ''}
              </div>
            </div>
          </div>
        ) : (
          <div className="book-box-wrapper b_f4f4f4">
            <div className="word-info">
              <span className="number">
                共{this.state.bookWords.length}
                个单词
              </span>
              {this.state.bookWords.length > 0 ? <span className={`btn-play${this.state.isPlaying ? ' stop' : ''}`} onClick={this.playAudio.bind(this)} /> : ''}
            </div>
            <NewWord onRef={this.onRef.bind(this)} onEnded={this.onEnded.bind(this)} isPlaying={this.state.isPlaying} />
          </div>
        )}
        {/* <CSSTransitionGroup
          transitionName="animate-slide"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
          transitionAppear={true}
          transitionAppearTimeout={300}>
          {this.state.isBookPlayShow ? <BookPlay back={this.hideBookPlay.bind(this)} bookPages={this.state.bookPages} readFlag={this.state.readFlag} goAnswer={this.playGoAnswer.bind(this)} /> : ''}
        </CSSTransitionGroup> */}
        {this.state.isBookPlayShow ? <BookPlay back={this.hideBookPlay.bind(this)} bookPages={this.state.bookPages} readFlag={this.state.readFlag} goAnswer={this.playGoAnswer.bind(this)} /> : ''}
        <Loading isLoading={this.state.isLoading} />
      </div>
    )
  }
  // 获取单词组件
  onRef(child) {
    this.child = child
  }
  // 播放完成或者暂停
  onEnded() {
    console.log('end')
    this.setState({
      isPlaying: false
    })
  }
  // 连续播放
  playAudio() {
    this.setState({
      isPlaying: true
    })
    this.child.autoPlay()
  }
  back() {
    // this.props.history.goBack()
    this.props.history.push('/')
  }
  changeType(type) {
    this.setState({
      type: type
    })
  }
  _getPbBook() {
    this.setState({
      isLoading: true
    })
    let params = {
      studentUserId: sessionStorage.studentUserId,
      bookId: this.state.bookId
    }
    getPbBook(params)
      .then(res => {
        this.setState({
          isLoading: false
        })
        saveStorageData('bookWords', res.bookWords)
        saveStorageData('bookPages', res.bookPages)
        this.setState(
          {
            bookPages: res.bookPages,
            image: res.image,
            bookName: res.bookName,
            topics: res.topics,
            gradeTermStr: res.gradeTermStr,
            readFlag: res.readFlag,
            answerFlag: res.answerFlag,
            score: res.score,
            errorCnt: res.errorCnt,
            bookQuestionCnt: res.bookQuestionCnt,
            vocabularyNum: res.vocabularyNum,
            bookWords: res.bookWords
          },
          () => {
            // 查看绘本
            if (sessionStorage.isBookPlayShow) {
              sessionStorage.removeItem('isBookPlayShow')
              this.showBookPlay()
            }
          }
        )
      })
      .catch(() => {
        this.setState({
          isLoading: false
        })
      })
  }
  showBookPlay() {
    if (this.state.bookPages.length > 0) {
      this.setState({
        isBookPlayShow: true
      })
    }
  }
  hideBookPlay() {
    this.setState({
      isBookPlayShow: false
    })
    this._getPbBook()
  }
  goAnswer() {
    if (this.state.readFlag === '1') {
      this.props.history.push('/answer')
    } else {
      window.layer.open({
        content: '请先读完绘本',
        skin: 'msg',
        time: 2 //2秒后自动关闭
      })
    }
  }
  playGoAnswer() {
    this.props.history.push('/answer')
  }
  goResult() {
    sessionStorage.score = this.state.score
    sessionStorage.from = 'book-start'
    this.props.history.push('/result')
  }
}
