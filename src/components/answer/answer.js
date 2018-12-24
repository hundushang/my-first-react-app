/**
 * Created by qlb
 */
import React, { Component } from 'react'
import CSSTransitionGroup from 'react-addons-css-transition-group'
import Head from '../head/head'
import { getPbBookQuestions, pbSubmit } from '../../api/index'
import { loadStorageData } from '../../assets/js/util'
import Loading from '../../base/loading/loading'
import BookPlay from '../book-play/book-play'
import './answer.less'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0,
      bookQuestions: [],
      isSelected: false,
      usedTime: 0,
      isLoading: false,
      isBookPlayShow: false,
      bookPages: loadStorageData('bookPages') || []
    }
  }
  render() {
    function formateOption(seq) {
      const _array = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      return _array[seq - 1]
    }
    return (
      <div className="fixed-bfff answer-wrapper">
        <Head back={this.back.bind(this)}>
          <span className="page-text">
            <b>{this.state.currentIndex + 1}/</b>
            {this.state.bookQuestions.length}
          </span>
        </Head>
        <div className="question-item-wrapper">
          {this.state.bookQuestions.length > 0 ? (
            <div className="question-item">
              <div className="item-title">
                {this.state.currentIndex + 1}. {this.state.bookQuestions[this.state.currentIndex].summarize}
              </div>
              {this.state.bookQuestions[this.state.currentIndex].image !== '' ? (
                <div className="item-img">
                  <img src={this.state.bookQuestions[this.state.currentIndex].image} alt="" />
                </div>
              ) : (
                ''
              )}
              {this.state.bookQuestions[this.state.currentIndex].answers.map((item, index) => {
                if (item.answerType !== 2) {
                  return (
                    <div
                      className={`item-option${this.state.bookQuestions[this.state.currentIndex].userAnswerInt === index ? ' current' : ''}`}
                      key={`option${index}`}
                      onClick={this.selectAnswer.bind(this, index)}
                    >
                      <i className="option-title">
                        <span className="text">{formateOption(item.seq)}</span>
                      </i>
                      {item.answerType === 1 ? (
                        <span className="option-text">
                          <span className="text">{item.answerTitle}</span>
                        </span>
                      ) : item.answerType === 2 ? (
                        <span className="option-text">
                          <img className="img" src={item.answerTitle} alt="" />
                        </span>
                      ) : (
                        <span className="option-text">{item.answerTitle === 'r' ? <i className="icon-right" /> : <i className="icon-wrong" />}</span>
                      )}
                    </div>
                  )
                } else {
                  return (
                    <div className="item-img-wrapper">
                      <div
                        className={`item-option-img${this.state.bookQuestions[this.state.currentIndex].userAnswerInt === index ? ' current' : ''}`}
                        key={`option${index}`}
                        onClick={this.selectAnswer.bind(this, index)}
                      >
                        <i className="option-title">
                          <span className="text">{formateOption(item.seq)}</span>
                        </i>
                        <span className="option-text">
                          <img className="img" src={item.answerTitle} alt="" />
                        </span>
                      </div>
                    </div>
                  )
                }
              })}
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="answer-operation border-1px">
          <span className="btn-look" onClick={this.showBookPlay.bind(this)}>
            查看绘本
          </span>
          <span className="flex-fill" />
          {this.state.currentIndex === 0 ? (
            ''
          ) : (
            <span className="btn-prev" onClick={this.prev.bind(this)}>
              上一题
            </span>
          )}
          {this.state.currentIndex < this.state.bookQuestions.length - 1 ? (
            <span onClick={this.next.bind(this)} className={`btn-next${this.state.bookQuestions.length > 0 && this.state.bookQuestions[this.state.currentIndex].userAnswerInt > -1 ? ' current' : ''}`}>
              下一题
            </span>
          ) : (
            <span className={`btn-next${this.state.bookQuestions.length > 0 && this.state.bookQuestions[this.state.currentIndex].userAnswerInt > -1 ? ' current' : ''}`} onClick={this.submit.bind(this)}>
              提交
            </span>
          )}
        </div>
        <CSSTransitionGroup transitionName="animate-slide" transitionEnterTimeout={300} transitionLeaveTimeout={300} transitionAppear={true} transitionAppearTimeout={300}>
          {this.state.isBookPlayShow ? <BookPlay back={this.hideBookPlay.bind(this)} bookPages={this.state.bookPages} readFlag="1" goAnswer={this.hideBookPlay.bind(this)} /> : ''}
        </CSSTransitionGroup>
        <Loading isLoading={this.state.isLoading} />
      </div>
    )
  }
  componentDidMount() {
    // 定时器开跑
    this._runTimer()
    this._getPbBookQuestions()
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
  _getPbBookQuestions() {
    this.setState({
      isLoading: true
    })
    let params = {
      studentUserId: sessionStorage.studentUserId,
      bookId: sessionStorage.bookId
    }
    getPbBookQuestions(params)
      .then(res => {
        this.setState({
          isLoading: false
        })
        res.bookQuestions.forEach(item => {
          item.userAnswerInt = -1
        })
        this.setState({
          bookQuestions: res.bookQuestions
        })
      })
      .catch(() => {
        this.setState({
          isLoading: false
        })
      })
  }
  selectAnswer(index) {
    let str = JSON.stringify(this.state.bookQuestions)
    let newBookQuestions = JSON.parse(str)
    newBookQuestions.forEach((item, newIndex) => {
      if (newIndex === this.state.currentIndex) {
        item.userAnswerInt = index
      }
    })
    this.setState({
      bookQuestions: newBookQuestions
    })
  }
  prev() {
    if (this.state.currentIndex > 0) {
      this.setState({
        currentIndex: this.state.currentIndex - 1
      })
    }
  }
  next() {
    if (this.state.bookQuestions[this.state.currentIndex].userAnswerInt <= -1) {
      return
    }
    this.setState({
      currentIndex: this.state.currentIndex + 1
    })
  }
  submit() {
    if (this.state.bookQuestions[this.state.currentIndex].userAnswerInt <= -1) {
      return
    }
    let answers = []
    let rightCount = 0
    this.state.bookQuestions.forEach((item, index) => {
      let resultFlag = 0
      item.answers.forEach((answer, answerIndex) => {
        // 答对了
        if (item.userAnswerInt === answerIndex && answer.correctFlag === 1) {
          resultFlag = 1
          rightCount++
        }
      })
      answers.push({
        questionId: item.questionId,
        resultFlag: resultFlag,
        userAnswer: [item.userAnswerInt + '']
      })
    })
    let params = {
      bookId: sessionStorage.bookId,
      studentUserId: sessionStorage.studentUserId,
      score: Math.floor(100 * (rightCount / this.state.bookQuestions.length)),
      usedTime: this.state.usedTime * 1000,
      answers: answers
    }
    // 清除定时器
    clearTimeout(this.timer)
    pbSubmit(params).then(res => {
      sessionStorage.score = res.score
      this.props.history.push('/result')
    })
  }
  showBookPlay() {
    this.setState({
      isBookPlayShow: true
    })
  }
  hideBookPlay() {
    this.setState({
      isBookPlayShow: false
    })
  }
  back() {
    sessionStorage.isBookPlayShow = 1
    // window.history.back()
    this.props.history.push('/bookStart')
  }
}
