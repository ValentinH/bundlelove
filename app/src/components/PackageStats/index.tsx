import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Divider, Typography } from '@material-ui/core'
import { PackageInfo } from 'services/api'
import Stat from './Stat'
import * as formatUtils from 'utils/format'

interface Props {
  info: PackageInfo
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    statsRow: {
      display: 'flex',
      justifyContent: 'space-evenly',
    },
    title: {
      marginBottom: theme.spacing(1),
      textTransform: 'uppercase',
      color: theme.palette.grey[500],
    },
    divider: {
      margin: theme.spacing(2, 0),
    },
  })
)

const PackageStats: React.FC<Props> = ({ info }) => {
  const classes = useStyles()
  const times = formatUtils.getTimeFromSize(info.gzip)
  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        Bundle size
      </Typography>
      <div className={classes.statsRow}>
        <Stat title="minified" value={info.size} unitType="size" />
        <Stat title="minified + gzipped" value={info.gzip} unitType="size" />
      </div>
      <Divider className={classes.divider} />
      <Typography variant="h5" className={classes.title}>
        Download time
      </Typography>
      <div className={classes.statsRow}>
        <Stat title="2G Edge" value={times.twoG} unitType="time" />
        <Stat title="Emerging 3G" value={times.threeG} unitType="time" />
      </div>
    </div>
  )
}
export default PackageStats
