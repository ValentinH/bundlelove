import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Header from 'components/Header'
import Footer from 'components/Footer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(1, 2),
      maxWidth: 1024,
      margin: 'auto',
    },
    content: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: 'calc(100vh - 107px)', // 107px = header + footer + main padding
      width: '100%',
    },
  })
)

const Layout: React.FC = ({ children }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.content}>{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
