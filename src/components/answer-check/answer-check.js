/**
 * Created by qlb
 */
import React, { Component } from 'react'
import Head from '../head/head'
import { getPbBookQuestions } from '../../api/index'
import Loading from '../../base/loading/loading'
import './answer-check.less'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0,
      bookQuestions: [],
      isSelected: false,
      isLoading: false,
      rightAnswer: 0
    }
  }
  render() {
    function formateOption(seq) {
      const _array = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      return _array[seq - 1]
    }
    return (
      <div className="fixed-bfff answer-wrapper answer-check-wrapper">
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
              <div className="right-answer">
                <span className="text">正确答案：</span>
                <span className="number">{formateOption(this.state.rightAnswer + 1)}</span>
              </div>
              {this.state.bookQuestions[this.state.currentIndex].answers.map((item, index) => {
                if (item.answerType !== 2) {
                  return (
                    <div
                      className={`item-option${item.correctFlag === 1 ? ' right' : this.state.bookQuestions[this.state.currentIndex].userAnswer[0] === index + '' ? ' wrong' : ''}`}
                      key={`option${index}`}
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
                        className={`item-option-img${item.correctFlag === 1 ? ' right' : this.state.bookQuestions[this.state.currentIndex].userAnswer[0] === index + '' ? ' wrong' : ''}`}
                        key={`option${index}`}
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
          <span className="flex-fill" />
          {this.state.currentIndex === 0 ? (
            ''
          ) : (
            <span className="btn-prev" onClick={this.prev.bind(this)}>
              上一题
            </span>
          )}
          {this.state.currentIndex < this.state.bookQuestions.length - 1 ? (
            <span onClick={this.next.bind(this)} className="btn-next current">
              下一题
            </span>
          ) : (
            ''
          )}
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
        res.bookQuestions.forEach(item => {
          item.userAnswerInt = -1
        })
        this.setState(
          {
            currentIndex: Number(sessionStorage.currentAnswerCheckNumber) || 0,
            bookQuestions: res.bookQuestions
          },
          () => {
            this._getRightAnswer()
          }
        )
      })
      .catch(() => {
        this.setState({
          isLoading: false
        })
      })
  }
  // 獲取每題的正確答案
  _getRightAnswer() {
    if (this.state.bookQuestions.length > 0) {
      this.state.bookQuestions[this.state.currentIndex].answers.forEach((item, index) => {
        if (item.correctFlag === 1) {
          this.setState({
            rightAnswer: index
          })
        }
      })
    }
  }
  prev() {
    if (this.state.currentIndex > 0) {
      this.setState(
        {
          currentIndex: this.state.currentIndex - 1
        },
        () => {
          this._getRightAnswer()
        }
      )
    }
  }
  next() {
    this.setState(
      {
        currentIndex: this.state.currentIndex + 1
      },
      () => {
        this._getRightAnswer()
      }
    )
  }
  back() {
    // window.history.back()
    this.props.history.push('/result')
  }
}
