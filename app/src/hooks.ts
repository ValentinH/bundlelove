import { useContext } from 'react'
import { __RouterContext as RouterContext, RouteComponentProps } from 'react-router'

// temporary custom hook until react-router provides its own
// https://github.com/ReactTraining/react-router/issues/6430
export function useRouter(): RouteComponentProps {
  return useContext(RouterContext)
}
