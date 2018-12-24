import React, { Component } from 'react'
import Head from '../../head/head'
import './article.less'

export default class extends Component {
  render() {
    return (
      <div className="article-wrapper fixed-bfff">
        <Head title="查看原文及翻译" back={this.props.back} />
        <div className="article-content absolute-top44">
          <div className="article-item">
            <div className="article-title">原文：</div>
            <div className="article-text">{this.props.text}</div>
          </div>
          <div className="article-item">
            <div className="article-title">翻译：</div>
            <div className="article-text explain">{this.props.explanation}</div>
          </div>
        </div>
      </div>
    )
  }
}
