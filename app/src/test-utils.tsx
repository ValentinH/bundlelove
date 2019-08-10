import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import Theme from 'components/Theme'
import { createBrowserHistory, History } from 'history'
import { Router } from 'react-router-dom'

interface Options extends RenderOptions {
  history?: History
}

const customRender = (ui: any, options: Options = {}) => {
  const { history = createBrowserHistory(), ...restOptions } = options

  const AllTheProviders: React.FC = ({ children }) => {
    return (
      <Theme>
        <Router history={history}>{children}</Router>
      </Theme>
    )
  }

  return render(ui, { wrapper: AllTheProviders, ...restOptions })
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
