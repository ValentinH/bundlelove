import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { CssBaseline } from '@material-ui/core'
import Home from './Home'
import Result from './Result'
import Theme from 'components/Theme'

ReactDOM.render(
  <Router>
    <Theme>
      <CssBaseline />
      <Route path="/" exact component={Home} />
      <Route path="/result" component={Result} />
    </Theme>
  </Router>,
  document.getElementById('root')
)
