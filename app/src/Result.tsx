import React from 'react'
import { RouteComponentProps } from 'react-router'
import qs from 'query-string'
import { CircularProgress, Typography } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import SearchInput from 'components/SearchInput'
import * as api from 'services/api'
import * as packageUtils from 'utils/package'
import PackageStats from 'components/PackageStats'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(2),
      maxWidth: 1024,
      margin: 'auto',
    },
    searchInput: {
      width: '100%',
      marginBottom: theme.spacing(4),
      [theme.breakpoints.up('sm')]: {
        width: 400,
      },
    },
    infoRow: {
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      },
    },
  })
)

const Result: React.FC<RouteComponentProps> = ({ history, location }) => {
  const classes = useStyles()
  const urlParams = qs.parse(location.search)
  const [searchValue, setSearchValue] = React.useState('')
  const [packageInfo, setPackageInfo] = React.useState<Maybe<api.PackageInfo>>(null)
  const [isFetchingInfo, setIsFetchinInfo] = React.useState(true)

  React.useEffect(() => {
    const { p } = urlParams
    if (typeof p === 'string' && p.trim()) {
      const search = p.trim()
      setSearchValue(search)

      // only submit the search if the package has really changed
      const { name } = packageUtils.getNameAndVersion(search)
      if (!packageInfo || name !== packageInfo.name) {
        onNewSearch(search)
      }
    } else {
      setIsFetchinInfo(false)
    }
  }, [urlParams.p])

  const onNewSearch = async (query: string) => {
    setIsFetchinInfo(true)
    const info = await api.getPackageInfo(query)
    setPackageInfo(info)
    if (info) {
      history.replace(`/result?p=${info.name}@${info.version}`)
    }
    setIsFetchinInfo(false)
  }

  const onSelect = (value: string) => {
    if (value) {
      history.push(`/result?p=${value.trim()}`)
    }
  }

  return (
    <div className={classes.root}>
      <SearchInput initialValue={searchValue} onSelect={onSelect} className={classes.searchInput} />
      {isFetchingInfo ? (
        <CircularProgress size={50} />
      ) : packageInfo ? (
        <div className={classes.infoRow}>
          <PackageStats info={packageInfo} />
          <div>History</div>
        </div>
      ) : (
        <Typography variant="subtitle1">Package not found</Typography>
      )}
    </div>
  )
}

export default Result
