import React, { Component } from 'react'
import Head from '../head/head'
import NavSelect from '../nav-select/nav-select'
import Book from '../book/book'
import gradeList from './gradeList'
import { getPbIndex } from '../../api/index'
import BScroll from 'better-scroll'
import Loading from '../../base/loading/loading'
import './index.less'
sessionStorage.studentUserId = window.studentUserId || 8999248
export default class extends Component {
  constructor() {
    super()
    this.state = {
      // 广告图
      series: [],
      list: [],
      currentItem: {},
      books: [],
      gradeList: gradeList,
      // 当前年级
      currentGrade: {},
      // 主题列表
      themeList: [],
      // 当前主题
      currentTheme: {},
      // 0---年级，1---主题
      type: 0,
      // banner循环
      loop: true,
      currentPageIndex: 0,
      autoPlay: true,
      isLoading: false,
      noneFlag: false,
      isVip: '0'
    }
  }
  componentDidMount() {
    // window.addEventListener('resize', () => {
    //   if (!this.slider || !this.slider.enabled) {
    //     return
    //   }
    //   clearTimeout(this.resizeTimer)
    //   this.resizeTimer = setTimeout(() => {
    //     if (this.slider.isInTransition) {
    //       this._onScrollEnd()
    //     } else {
    //       if (this.autoPlay) {
    //         this._play()
    //       }
    //     }
    //     this.refresh()
    //   }, 60)
    // })
    this._getPbIndex()
  }
  render() {
    return (
      <div className="index-wrapper">
        <Head title="绘本练习" back={this.back.bind(this)} />
        <div className="index-box">
          <div className="slider-box">
            <div className="block-wrapper" ref="slider">
              <div className="slider-group" ref="sliderGroup">
                {this.state.series.map((item, index) => {
                  return (
                    <div className="slider-item" key={`banner${index}`} onClick={this.goSeries.bind(this, item.seriesId)}>
                      <img src={item.banner} alt={item.serieName} />
                    </div>
                  )
                })}
              </div>
              <div className="dots">
                {this.state.series.map((item, index) => {
                  return <span className={`dot${this.state.currentPageIndex === index ? ' active' : ''}`} key={`dot${index}`} />
                })}
              </div>
            </div>
          </div>
          <div className="nav-wrapper border-1px">
            <div className="nav-item" onClick={this.showGradeList.bind(this)}>
              <span className="text">{this.state.currentGrade.text}册</span>
            </div>
            <div className="nav-item" onClick={this.showThemeList.bind(this)}>
              <span className="text">{this.state.currentTheme.text}</span>
            </div>
          </div>
          <ul className="pic-list-wrapper">
            {this.state.books.map((book, index) => {
              let ret = true
              let count = 0
              book.topics.forEach(topic => {
                if (this.state.currentTheme.topicId === 0 || topic.topicName === this.state.currentTheme.topicName) {
                  count++
                }
              })
              if (count === 0) {
                ret = false
              }
              if (ret) {
                return <Book book={book} index={index} key={`book${index}`} bookClick={this.goBook.bind(this, book)} />
              } else {
                return ''
              }
            })}
            {this.state.noneFlag ? (
              <div className="index-none">
                <div className="none-img" />
                <div className="none-text">暂无相关内容</div>
              </div>
            ) : (
              ''
            )}
          </ul>
        </div>
        <NavSelect list={this.state.list} selectItem={this.selectItem.bind(this)} currentItem={this.state.currentItem} getNavSelect={this.getNavSelect.bind(this)} />
        <Loading isLoading={this.state.isLoading} />
      </div>
    )
  }
  back() {
    // window.history.go(-1)
    window.location.href = 'https://www.up360.com/sso/passport/cp/cpLanding'
  }
  // 获取首页信息
  _getPbIndex() {
    this.setState({
      isLoading: true
    })
    let params = {
      studentUserId: sessionStorage.studentUserId,
      grade: this.state.currentGrade.grade,
      term: this.state.currentGrade.term
    }
    getPbIndex(params)
      .then(res => {
        this.setState({
          isLoading: false
        })
        if (!res.topics) {
          res.topics = []
        }
        if (!res.books) {
          res.books = []
          this.setState({
            noneFlag: true
          })
        } else {
          this.setState({
            noneFlag: false
          })
        }
        // 插入一个全部主题
        res.topics.unshift({
          topicId: 0,
          topicName: '全部主题'
        })
        // 遍历topic的text
        res.topics.forEach((topic, index) => {
          topic.text = topic.topicName
        })
        // 获取当前grade
        this.state.gradeList.forEach(item => {
          if (item.grade + '' === res.grade && item.term + '' === res.term) {
            this.setState({
              currentGrade: item
            })
          }
        })
        this.setState(
          {
            books: res.books,
            themeList: res.topics,
            currentTheme: res.topics[0],
            series: res.series,
            isVip: res.isVip
          },
          () => {
            if (this.slider) {
              this.slider.refresh()
            } else {
              this._setSliderWidth()
              this._initDots()
              this._initSlider()
              if (this.state.autoPlay) {
                this._play()
              }
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

  _setSliderWidth(isResize) {
    this.children = this.refs.sliderGroup.children

    let width = 0
    let sliderWidth = this.refs.slider.clientWidth
    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i]

      child.style.width = sliderWidth + 'px'
      width += sliderWidth
    }
    if (this.state.loop && !isResize) {
      width += 2 * sliderWidth
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
      if (this.state.autoPlay) {
        clearTimeout(this.timer)
      }
    })
  }
  _onScrollEnd() {
    let pageIndex = this.slider.getCurrentPage().pageX
    this.setState({
      currentPageIndex: pageIndex
    })
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
      this.slider.next()
    }, 4000)
  }
  goSeries(seriesId) {
    sessionStorage.seriesId = seriesId
    this.props.history.push('/serieBook')
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
  // 获取子组件对象
  getNavSelect(ref) {
    this.navSelectRef = ref
  }
  // 显示年级列表
  showGradeList() {
    this.setState({
      type: 0,
      currentItem: this.state.currentGrade
    })
    this.setState({
      list: this.state.gradeList
    })
    this.navSelectRef.show()
  }
  // 显示主题列表
  showThemeList() {
    this.setState({
      type: 1,
      currentItem: this.state.currentTheme
    })
    this.setState(
      {
        list: this.state.themeList
      },
      () => {
        this.navSelectRef.show()
      }
    )
  }
  // 选择item
  selectItem(item) {
    // 选择年级
    if (!this.state.type) {
      this.setState(
        {
          currentGrade: item
        },
        () => {
          this._getPbIndex()
        }
      )
    } else {
      // 选择主题
      this.setState({
        currentTheme: item
      })
    }
  }
}
