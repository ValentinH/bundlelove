import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#ff5364' },
    secondary: { main: '#ffc624' },
  },
})

const Theme: React.FC = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>

export default Theme
