import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { CircularProgress, Typography } from '@material-ui/core'
import * as api from 'services/api'
import Charts from './Charts'

interface Props {
  name: string
  onSelect: (version: string) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
  })
)

const PackageHistory: React.FC<Props> = ({ name, onSelect }) => {
  const classes = useStyles()
  const [packageHistory, setPackageHistory] = React.useState<Maybe<api.PackageHistory>>(null)
  const [isFetchingHistory, setIsFetchingHistory] = React.useState(true)

  React.useEffect(() => {
    let active = true
    async function call() {
      setIsFetchingHistory(true)
      try {
        const pHistory = await api.getPackageHistory(name)
        if (active) {
          setPackageHistory(pHistory)
          setIsFetchingHistory(false)
        }
      } catch (e) {
        setPackageHistory(null)
        setIsFetchingHistory(false)
      }
    }
    call()

    return () => {
      active = false
    }
  }, [name])

  return (
    <div className={classes.root}>
      {isFetchingHistory ? (
        <CircularProgress size={30} />
      ) : packageHistory ? (
        <Charts history={packageHistory} onSelect={onSelect} />
      ) : (
        <Typography variant="subtitle1">Could not get history</Typography>
      )}
    </div>
  )
}
export default PackageHistory
