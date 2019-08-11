import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { CssBaseline } from '@material-ui/core'
import Home from './Home'
import Result from './Result'
import Credits from './Credits'
import Theme from 'components/Theme'
import Layout from 'components/Layout'

ReactDOM.render(
  <Router>
    <Theme>
      <CssBaseline />
      <Layout>
        <Route path="/" exact component={Home} />
        <Route path="/result" component={Result} />
        <Route path="/credits" component={Credits} />
      </Layout>
    </Theme>
  </Router>,
  document.getElementById('root')
)
