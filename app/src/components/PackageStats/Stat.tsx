import React from 'react'
import { useId } from 'react-id-generator'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import * as formatUtils from 'utils/format'

interface Props {
  title: string
  value: number
  unitType: 'time' | 'size'
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    statsRow: {
      display: 'flex',
      justifyContent: 'space-evenly',
    },
    number: {
      animation: '$grow 0.4s ease-in',
      '&:hover': {
        transform: 'scale(1.1)',
      },
    },
    unit: {
      color: theme.palette.primary.main,
    },
    time: {
      position: 'relative',
      '&:before': {
        content: 'attr(data-value)',
        position: 'absolute',
        zIndex: 2,
        overflow: 'hidden',
        color: theme.palette.secondary.main,
        transition: 'width 0.5s',
        transitionDuration: 'inherit',
        width: 0,
      },
      '&:hover:before': {
        width: '100%',
      },
    },
    '@keyframes grow': {
      from: {
        transform: 'scale(0)',
      },
      to: {
        transform: 'scale(1)',
      },
    },
  })
)

const Stat: React.FC<Props> = ({ title, value, unitType }) => {
  const classes = useStyles()
  const { size, unit } =
    unitType === 'size' ? formatUtils.formatSize(value) : formatUtils.formatTime(value)
  const roundedSize =
    unitType === 'size' ? parseFloat(size.toFixed(1)) : parseFloat(size.toFixed(2))
  const [htmlId] = useId()
  return (
    <div>
      <div aria-labelledby={htmlId} className={classes.number}>
        <Typography
          variant="h3"
          component="span"
          data-value={roundedSize}
          className={unitType === 'time' ? classes.time : undefined}
          style={{
            transitionDuration: `${size}${unit}`,
          }}
        >
          {roundedSize}
        </Typography>
        <Typography variant="h5" component="span" className={classes.unit}>
          {unit}
        </Typography>{' '}
      </div>
      <Typography id={htmlId} variant="overline">
        {title}
      </Typography>
    </div>
  )
}
export default Stat
