import React from 'react'
import { Link } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      alignSelf: 'flex-start',
      marginBottom: theme.spacing(2),
    },
    headerLink: {
      textDecoration: 'none',
      color: 'initial',
    },
    red: {
      color: theme.palette.primary.main,
    },
  })
)

const Header: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.header}>
      <Link to="/" className={classes.headerLink}>
        <Typography variant="h5" component="h1">
          Bundle<span className={classes.red}>Love</span>
        </Typography>
      </Link>
    </div>
  )
}

export default Header
