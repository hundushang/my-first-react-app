/**
 * Created by qlb
 */
import React, { Component } from 'react'
import Head from '../head/head'
import { getPbBookQuestions } from '../../api/index'
import Loading from '../../base/loading/loading'
import './result.less'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bookQuestions: [],
      wrongCount: 0,
      isLoading: false
    }
  }
  render() {
    let score = sessionStorage.score
    return (
      <div className="fixed-bfff result-wrapper">
        <Head title="成绩" back={this.back.bind(this)} />
        <div className="result-content">
          <div className="score-wrapper">
            <p className="score-text">{score}分</p>
            <p className="score-line" />
            {this.state.wrongCount === 0 ? (
              <p className="score-tips">你太棒了！</p>
            ) : (
              <p className="score-tips">
                答错
                {this.state.wrongCount}
                题，继续努力哦！
              </p>
            )}
            <i className="icon-score"></i>
            <div className="result-answer">
              <div className="result-answer-title">
                <span className="text">答题情况</span>
              </div>
              <ul className="answer-list">
                {this.state.bookQuestions.map((item, index) => {
                  return (
                    <li className="answer-item" key={`answer${index}`} onClick={this.goCheckAnswer.bind(this, index)}>
                      {item.resultFlag === '0' ? <i className="icon-wrong" /> : <i className="icon-right" />}
                      <span className="seq">{item.questionNo}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="bottom-btn border-1px">
          <div className="btn-read" onClick={this.reRead.bind(this)}>
            重读一遍
          </div>
          <div className="btn-again" onClick={this.reAnswer.bind(this)}>
            再练一练
          </div>
        </div>
        <Loading isLoading={this.state.isLoading} />
      </div>
    )
  }
  componentDidMount() {
    this._getPbBookQuestions()
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
        let wrongCount = 0
        res.bookQuestions.forEach(item => {
          if (item.resultFlag === '0') {
            wrongCount++
          }
        })
        this.setState({
          bookQuestions: res.bookQuestions,
          wrongCount: wrongCount
        })
      })
      .catch(() => {
        this.setState({
          isLoading: false
        })
      })
  }
  // 查看错题
  goCheckAnswer(index) {
    sessionStorage.currentAnswerCheckNumber = index
    this.props.history.push('/answerCheck')
  }
  back() {
    this.props.history.push('/bookStart')
    // window.history.go(-1)
    // if (sessionStorage.from === 'book-start') {
    //   window.history.go(-1)
    // } else {
    //   window.history.go(-2)
    // }
    // sessionStorage.removeItem('from')
  }
  reRead() {
    sessionStorage.isBookPlayShow = 1
    // this.back()
    this.props.history.push('/bookStart')
    // window.history.go(-2)
  }
  reAnswer() {
    this.props.history.push('/answer')
    // window.history.go(-1)
  }
}
