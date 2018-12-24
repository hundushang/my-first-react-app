import React, { Component } from 'react'
import Head from '../../head/head'
import NewWord from '../../new-word/new-word'
import './words.less'

export default class extends Component {
  render() {
    return (
      <div className="words-wrapper fixed-bfff">
        <Head title="生词表" back={this.props.back} />
        <div className="absolute-top44">
          <NewWord />
        </div>
      </div>
    )
  }
}
