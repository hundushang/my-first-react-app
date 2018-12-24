import React, { Component } from 'react'
import Head from '../head/head'
import Book from '../book/book'
import { getPbSerieBooks } from '../../api/index'
import Loading from '../../base/loading/loading'
import './serie-books.less'

export default class extends Component {
  constructor() {
    super()
    this.state = {
      image: '',
      content: '',
      gradeTermBooks: [],
      isLoading: false,
      isVip: '0'
    }
  }
  componentDidMount() {
    this._getPbSerieBooks()
  }
  render() {
    const ARR_GRADE = ['', '一', '二', '三', '四', '五', '六']
    const ARR_TERM = ['', '上', '下']
    return (
      <div className="fixed-bfff seriebook-wrapper">
        <Head title="绘本系列" back={this.back.bind(this)} />
        <div className="absolute-top44">
          <div className="desc-wrapper border-1px">
            <div className="img-box">
              <div className="img-wrapper">
                <img src={this.state.image} alt="" />
                <div className="bookleft" />
              </div>
            </div>
            <div className="img-box-bottom" />
            <div className="text">{this.state.content}</div>
          </div>
          <div className="seriebook-list-wrapper border-1px">
            {this.state.gradeTermBooks.map((grade, gradeIndex) => {
              return (
                <div className="serie-item" key={`serie${gradeIndex}`}>
                  <div className="title">
                    <span className="text">{`${ARR_GRADE[grade.grade]}年级${ARR_TERM[grade.term]}学期`}</span>
                  </div>
                  <div className="content">
                    {grade.books.map((book, index) => {
                      return <Book book={book} index={index} key={`book${index}`} bookClick={this.goBook.bind(this, book)} />
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <Loading isLoading={this.state.isLoading} />
      </div>
    )
  }
  back() {
    // this.props.history.goBack()
    this.props.history.push('/')
  }
  goBook(book) {
    if (this.state.isVip === '0' && book.isFree === '0') {
    window.layer.open({
      content: '非CP用户，无权限打开',
      skin: 'msg',
      time: 1 //1秒后自动关闭
    })
    return
  }
    sessionStorage.bookId = book.bookId
    this.props.history.push('/bookStart')
  }
  _getPbSerieBooks() {
    this.setState({
      isLoading: true
    })
    let params = {
      studentUserId: sessionStorage.studentUserId,
      seriesId: sessionStorage.seriesId
    }
    getPbSerieBooks(params)
      .then(res => {
        this.setState({
          isLoading: false
        })
        this.setState({
          gradeTermBooks: res.gradeTermBooks,
          content: res.content,
          image: res.image,
          isVip: res.isVip
        })
      })
      .catch(() => {
        this.setState({
          isLoading: false
        })
      })
  }
}
