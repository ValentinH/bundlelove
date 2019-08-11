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
      maxHeight: 250,
      paddingBottom: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      [theme.breakpoints.up('sm')]: {
        height: '100%',
      },
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
      transition: 'background 0.2s',
      transformOrigin: '100% 100%',
      animation: '$grow 0.4s ease-in',
    },
    gzipBar: {
      position: 'absolute',
      bottom: 0,
      background: theme.palette.primary.main,
      width: '100%',
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      transition: 'background 0.2s',
      transformOrigin: '100% 100%',
      animation: '$grow 0.4s ease-in',
    },
    barLabel: {
      position: 'absolute',
      bottom: -40,
      left: 4,
      transform: 'rotate(270deg)',
      opacity: 0,
      animation: '$fade 0.5s 0.1s forwards ease-in',
    },
    '@keyframes grow': {
      from: {
        transform: 'scaleY(0)',
      },
      to: {
        transform: 'scaleY(1)',
      },
    },
    '@keyframes fade': {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
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
            aria-label={`${item.version}: ${tooltipTitle}`}
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
