import React from 'react'
import { Link, Typography } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { PackageInfo } from 'services/api'
import GithubLogo from './GithubLogo'

interface Props {
  info: PackageInfo
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing(3),
    },
    logolink: {
      display: 'flex',
      marginLeft: theme.spacing(1),
    },
    logo: {
      width: 20,
      height: 20,
    },
  })
)

const PackageDescription: React.FC<Props> = ({ info }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography>{info.description}</Typography>
      <Link
        href={info.repository}
        target="_blank"
        rel="noopener noreferrer"
        title="Github repository"
        className={classes.logolink}
      >
        <GithubLogo className={classes.logo} />
      </Link>
    </div>
  )
}

export default PackageDescription
