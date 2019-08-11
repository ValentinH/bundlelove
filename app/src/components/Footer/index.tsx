import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      marginTop: theme.spacing(3),
    },
  })
)

const Header: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.footer}>
      <Link component={RouterLink} to="/credits">
        Credits
      </Link>{' '}
      - Made with ❤️ by <Link href="https://valentin-hervieu.fr">Valentin Hervieu</Link>
    </div>
  )
}

export default Header
