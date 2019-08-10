import React from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Logo from 'components/Logo'
import SearchInput from 'components/SearchInput'
import { useRouter } from 'hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: theme.spacing(2),
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: theme.spacing(3),
    },
    red: {
      color: theme.palette.primary.main,
    },
    search: {
      marginTop: theme.spacing(3),
      marginBottom: '35vh',
    },
  })
)

const Home: React.FC = () => {
  const classes = useStyles()
  const { history } = useRouter()

  const onSelect = (value: string) => {
    if (value) {
      history.push(`/result?p=${value}`)
    }
  }

  return (
    <div className={classes.root}>
      <Logo className={classes.logo} />
      <Typography variant="h3" component="h1">
        Bundle<span className={classes.red}>Love</span>
      </Typography>
      <Typography variant="subtitle1">
        find the cost of adding a npm package to your bundle
      </Typography>
      <SearchInput onSelect={onSelect} className={classes.search} />
    </div>
  )
}

export default Home
