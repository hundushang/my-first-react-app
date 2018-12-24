import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Index from '../components/index/index'
import serieBook from '../components/serie-books/serie-books'
import bookStart from '../components/book-start/book-start'
import answer from '../components/answer/answer'
import result from '../components/result/result'
import answerCheck from '../components/answer-check/answer-check'
const Routes = () => (
  <div className="app">
    <Router>
      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/serieBook" exact component={serieBook} />
        <Route path="/bookStart" exact component={bookStart} />
        <Route path="/answer" exact component={answer} />
        <Route path="/result" exact component={result} />
        <Route path="/answerCheck" exact component={answerCheck} />
      </Switch>
    </Router>
  </div>
)

export default Routes
