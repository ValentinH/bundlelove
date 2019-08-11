import React from 'react'
import { darken, makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Tooltip, Typography } from '@material-ui/core'
import { PackageHistory } from 'services/api'
import * as formatUtils from 'utils/format'

interface Props {
  history: PackageHistory
  onSelect: (version: string) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '40vh',
      marginBottom: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    bar: {
      cursor: 'pointer',
      margin: theme.spacing(0, 1),
      width: 40,
      position: 'relative',
      bottom: 0,
      '&:hover $sizeBar ': {
        background: darken(theme.palette.secondary.main, 0.1),
      },
      '&:hover $gzipBar ': {
        background: darken(theme.palette.primary.main, 0.1),
      },
      '&:hover $barLabel ': {
        fontWeight: 'bold',
      },
    },
    sizeBar: {
      background: theme.palette.secondary.main,
      width: '100%',
      height: '100%',
      borderRadius: 5,
    },
    gzipBar: {
      position: 'absolute',
      bottom: 0,
      background: theme.palette.primary.main,
      width: '100%',
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
    },
    barLabel: {
      position: 'absolute',
      bottom: -40,
      transform: 'rotate(270deg)',
    },
  })
)

const Charts: React.FC<Props> = ({ history, onSelect }) => {
  const classes = useStyles()
  const maxSize = Math.max(...history.map(item => item.size))

  return (
    <figure className={classes.root}>
      {history.map(item => {
        const { size: gzipSize, unit: gzipUnit } = formatUtils.formatSize(item.gzip)
        const { size: normalSize, unit: normalUnit } = formatUtils.formatSize(item.size)
        const roundedGzip = parseFloat(gzipSize.toFixed(1))
        const roundedNormal = parseFloat(normalSize.toFixed(1))

        const tooltipTitle = `Minified: ${roundedNormal}${normalUnit} | Gzipped: ${roundedGzip}${gzipUnit}`
        return (
          <Tooltip
            title={tooltipTitle}
            placement="top"
            key={item.version}
            onClick={() => onSelect(item.version)}
          >
            <div className={classes.bar} style={{ height: `${(item.size / maxSize) * 100}%` }}>
              <div className={classes.sizeBar} />
              <div
                className={classes.gzipBar}
                style={{ height: `${(item.gzip / item.size) * 100}%` }}
              />
              <Typography variant="caption" className={classes.barLabel}>
                {item.version}
              </Typography>
            </div>
          </Tooltip>
        )
      })}
    </figure>
  )
}
export default Charts
