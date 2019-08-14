import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography, Tooltip } from '@material-ui/core'
import colormap from 'colormap'
import { PackageInfo } from 'services/api'
import * as formatUtils from 'utils/format'
import { getTreemapData } from './helpers'

interface Props {
  info: PackageInfo
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
    },
    treemap: {
      position: 'relative',
      borderRadius: theme.spacing(1),
      overflow: 'hidden',
      flex: 1,
    },
    rectangle: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      filter: 'brightness(110%)',
      color: theme.palette.grey[900],
      wordBreak: 'break-all',
      '&:hover': {
        filter: 'brightness(120%)',
        color: theme.palette.common.black,
      },
    },
    title: {
      marginBottom: theme.spacing(1),
    },
  })
)

const PackageComposition: React.FC<Props> = ({ info }) => {
  const classes = useStyles()

  const rectangles = getTreemapData(info)
  const colors = colormap({
    colormap: 'portland',
    nshades: Math.max(rectangles.length, 5), // portland map requires nshades to be at least size 5
    format: 'rgbaString',
    alpha: 0.8,
  })

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        Composition
      </Typography>
      <div className={classes.treemap}>
        {rectangles.map((rect, i) => {
          const percent = (rect.value / info.size) * 100
          const percentString = parseFloat(percent.toFixed(1))
          const { size, unit } = formatUtils.formatSize(rect.value)
          const roundedSize = parseFloat(size.toFixed(1))

          const tooltipTitle = `${rect.name} | ${percentString}% | ${roundedSize}${unit}`

          const content = (
            <Tooltip title={tooltipTitle} placement="top">
              <div
                className={classes.rectangle}
                style={{
                  left: `${rect.x}%`,
                  top: `${rect.y}%`,
                  width: `${rect.width}%`,
                  height: `${rect.height}%`,
                  background: colors[i],
                  cursor: rect.name === '(self)' ? 'default' : 'pointer',
                }}
                data-testid="composition-rectangle"
              >
                {rect.width > 10 && rect.height > 10 ? rect.name : '...'}
              </div>
            </Tooltip>
          )

          return rect.name === '(self)' ? (
            <div key={rect.name}>{content}</div>
          ) : (
            <a
              href={`/result?p=${rect.name}`}
              target="_blank"
              rel="noopener noreferrer"
              title={rect.name}
              key={rect.name}
            >
              {content}
            </a>
          )
        })}
      </div>
    </div>
  )
}
export default PackageComposition
