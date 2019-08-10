import React from 'react'
import Autosuggest from 'react-autosuggest'
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
    suggestionsContainerOpen: {
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

const renderInputComponent = (inputProps: any) => {
  const { classes, ref, isSearching, onSubmit, ...other } = inputProps
  return (
    <form className={classes.search} onSubmit={onSubmit}>
      <TextField
        variant="outlined"
        classes={{
          root: classes.input,
        }}
        InputProps={{
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
        innerRef={ref}
        {...other}
      />
    </form>
  )
}

const renderSuggestion = (
  suggestion: Suggestion,
  { isHighlighted }: Autosuggest.RenderSuggestionParams,
  { classes }: { classes: { [key: string]: string } }
) => {
  return (
    <MenuItem selected={isHighlighted} dense component="div">
      <div className={classes.suggestion}>
        <div dangerouslySetInnerHTML={{ __html: suggestion.highlight }} />
        <Typography variant="caption" component="div" className={classes.suggestionDescription}>
          {suggestion.package.description}
        </Typography>
      </div>
    </MenuItem>
  )
}

const getSuggestionValue = (suggestion: Suggestion) => suggestion.package.name

export default function Search({ onSelect, ...otherProps }: Props) {
  const classes = useStyles()
  const [input, setInput] = React.useState('')
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [lastSearch, setLastSearch] = React.useState(null)

  const onSuggestionSelected = (
    _event: React.SyntheticEvent<{}>,
    { suggestionValue }: Autosuggest.SuggestionSelectedEventData<Suggestion>
  ) => {
    _event.preventDefault()
    onSelect(suggestionValue)
  }

  const onSubmit = (e: React.SyntheticEvent<{}>) => {
    e.preventDefault()
    onSelect(input)
  }

  const [fetchSuggestions] = useDebouncedCallback(async (value: any) => {
    setIsSearching(true)
    const suggestions = await getPackagesSuggestions(value)
    setSuggestions(suggestions)
    setIsSearching(false)
  }, 300)

  const handleSuggestionsFetchRequested = ({ value }: any) => {
    if (value !== lastSearch) {
      fetchSuggestions(value)
      setLastSearch(value)
    }
  }

  const handleChange = (_event: React.ChangeEvent<{}>, { newValue }: Autosuggest.ChangeEvent) => {
    setInput(newValue)
  }

  const autosuggestProps = {
    renderInputComponent,
    suggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: () => {},
    getSuggestionValue,
    renderSuggestion: (suggestion: Suggestion, params: Autosuggest.RenderSuggestionParams) =>
      renderSuggestion(suggestion, params, { classes }),
    onSuggestionSelected,
  }

  return (
    <div {...otherProps}>
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          id: 'search-input',
          placeholder: 'find package',
          value: input,
          onChange: handleChange,
          isSearching,
          onSubmit,
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
    </div>
  )
}
