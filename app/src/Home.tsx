import React from 'react'
import { TextField, Typography } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Logo from 'components/Logo'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: theme.spacing(3),
    },
    red: {
      color: theme.palette.primary.main,
    },
  })
)

const Home: React.FC = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Logo className={classes.logo} />
      <Typography variant="h3" component="h1">
        Bundle<span className={classes.red}>Love</span>
      </Typography>
      <Typography variant="subtitle1">
        find the cost of adding a npm package to your bundle
      </Typography>
      <TextField />
    </div>
  )
}

export default Home
