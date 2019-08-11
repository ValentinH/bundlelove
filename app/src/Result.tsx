import React from 'react'
import { RouteComponentProps } from 'react-router'
import qs from 'query-string'
import { CircularProgress, Typography } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import SearchInput from 'components/SearchInput'
import * as api from 'services/api'
import * as packageUtils from 'utils/package'
import PackageStats from 'components/PackageStats'
import PackageHistory from 'components/PackageHistory'

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
      display: 'grid',
      gridTemplateRows: 'auto',
      gridRowGap: theme.spacing(3),
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'none',
      },
    },
  })
)

const Result: React.FC<RouteComponentProps> = ({ history, location }) => {
  const classes = useStyles()
  const [searchValue, setSearchValue] = React.useState('')
  const [packageInfo, setPackageInfo] = React.useState<Maybe<api.PackageInfo>>(null)
  const [isFetchingInfo, setIsFetchingInfo] = React.useState(true)

  const onNewSearch = React.useCallback(
    async (query: string) => {
      setIsFetchingInfo(true)
      try {
        const info = await api.getPackageInfo(query)
        setPackageInfo(info)
        if (info) {
          history.replace(`/result?p=${info.name}@${info.version}`)
        }
      } catch (e) {
        setPackageInfo(null)
      }
      setIsFetchingInfo(false)
    },
    [history]
  )

  React.useEffect(() => {
    const { p } = qs.parse(location.search)
    if (typeof p === 'string' && p.trim()) {
      const search = p.trim()
      setSearchValue(search)

      // only submit the search if the package has really changed
      const { name } = packageUtils.getNameAndVersion(search)
      if (!packageInfo || name !== packageInfo.name) {
        onNewSearch(search)
      }
    } else {
      setIsFetchingInfo(false)
    }
  }, [location, packageInfo, onNewSearch])

  const onSelect = (value: string) => {
    if (value) {
      history.push(`/result?p=${value.trim()}`)
    }
  }

  const onVersionSelect = (version: string) => {
    if (packageInfo) {
      const newPackageName = `${packageInfo.name}@${version}`
      onNewSearch(newPackageName)
      history.push(`/result?p=${newPackageName}`)
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
          <PackageHistory name={packageInfo.name} onSelect={onVersionSelect} />
        </div>
      ) : (
        <Typography variant="subtitle1">Package not found</Typography>
      )}
    </div>
  )
}

export default Result
