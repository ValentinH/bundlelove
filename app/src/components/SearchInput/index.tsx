import React from 'react'
import Downshift from 'downshift'
import { useDebouncedCallback } from 'use-debounce'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import {
  InputAdornment,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Paper,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { getPackagesSuggestions, Suggestion } from 'services/npms'

interface Props {
  onSelect: (value: string) => void
  [key: string]: any
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
    input: {
      color: 'inherit',
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 400,
      },
    },
    spinner: {
      marginRight: theme.spacing(2),
    },
    suggestionsContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      maxHeight: '35vh',
      overflow: 'auto',
    },
    suggestionsList: {
      margin: 0,
      padding: 0,
      listStyleType: 'none',
    },
    suggestion: {
      lineHeight: 1.2,
      padding: '4px 0',
      width: '100%',
      '& em': {
        fontWeight: 'bold',
        fontStyle: 'normal',
      },
    },
    suggestionDescription: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  })
)

export default function Search({ onSelect, ...otherProps }: Props) {
  const classes = useStyles()
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([])
  const [isSearching, setIsSearching] = React.useState(false)

  const onSuggestionSelected = (suggestion: Suggestion) => {
    onSelect(suggestion.package.name)
  }

  const onSubmit = (value: Maybe<string>) => {
    if (value) {
      onSelect(value)
    }
  }

  const [fetchSuggestions] = useDebouncedCallback(async (value: any) => {
    setIsSearching(true)
    const suggestions = await getPackagesSuggestions(value)
    setSuggestions(suggestions)
    setIsSearching(false)
  }, 300)

  const onInputValueChange = (value: string) => {
    if (value) {
      fetchSuggestions(value)
    }
  }

  return (
    <div {...otherProps}>
      <Downshift
        id="downshift-simple"
        onChange={onSuggestionSelected}
        onInputValueChange={onInputValueChange}
        itemToString={(suggestion: Maybe<Suggestion>) =>
          suggestion ? suggestion.package.name : ''
        }
        defaultHighlightedIndex={0}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          openMenu,
          closeMenu,
        }) => {
          const { onBlur, onFocus, ...inputProps } = getInputProps({
            placeholder: 'find package',
            onFocus: openMenu,
            onBlur: (e: React.SyntheticEvent<HTMLInputElement>) => {
              closeMenu()
              // @ts-ignore https://github.com/downshift-js/downshift/issues/734
              e.nativeEvent.preventDownshiftDefault = true
            },
          })

          return (
            <form
              onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => {
                e.preventDefault()
                onSubmit(inputValue)
              }}
              className={classes.container}
            >
              <TextField
                variant="outlined"
                classes={{
                  root: classes.input,
                }}
                InputLabelProps={getLabelProps()}
                InputProps={{
                  onBlur,
                  onFocus,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: isSearching && (
                    <InputAdornment position="end">
                      <CircularProgress
                        color="secondary"
                        size={20}
                        thickness={4}
                        className={classes.spinner}
                      />
                    </InputAdornment>
                  ),
                }}
                inputProps={inputProps}
              />
              <div {...getMenuProps()} className={classes.suggestionsContainer}>
                {isOpen ? (
                  <Paper square>
                    {suggestions.map((suggestion, index) => (
                      <MenuItem
                        {...getItemProps({ item: suggestion })}
                        selected={highlightedIndex === index}
                        dense
                        key={suggestion.package.name}
                      >
                        <div className={classes.suggestion}>
                          <div dangerouslySetInnerHTML={{ __html: suggestion.highlight }} />
                          <Typography
                            variant="caption"
                            component="div"
                            className={classes.suggestionDescription}
                          >
                            {suggestion.package.description}
                          </Typography>
                        </div>
                      </MenuItem>
                    ))}
                  </Paper>
                ) : null}
              </div>
            </form>
          )
        }}
      </Downshift>
    </div>
  )
}
