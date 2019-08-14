import React from 'react'
import { render } from 'test-utils'

import PackageComposition from './index'

describe('PackageComposition', () => {
  it('should display the right number of rectangles and links', async () => {
    const info = {
      name: 'react-easy-crop',
      version: '1.14.0',
      description: 'whatever',
      repository: 'https://github.com/ricardo-ch/react-easy-crop',
      size: 34300,
      gzip: 12500,
      dependencySizes: [
        { name: 'react-easy-crop', approximateSize: 15000 },
        { name: '@emotion/stylis', approximateSize: 10000 },
        { name: '@emotion/core', approximateSize: 5000 },
      ],
    }

    const { getAllByTestId, getAllByRole } = render(<PackageComposition info={info} />)

    expect(getAllByTestId('composition-rectangle')).toHaveLength(3)
    expect(getAllByRole('link')).toHaveLength(2) // self does not have a link
  })

  it('should render the links with the right href', async () => {
    const info = {
      name: 'react-easy-crop',
      version: '1.14.0',
      description: 'whatever',
      repository: 'https://github.com/ricardo-ch/react-easy-crop',
      size: 34300,
      gzip: 12500,
      dependencySizes: [
        { name: 'react-easy-crop', approximateSize: 15000 },
        { name: '@emotion/stylis', approximateSize: 10000 },
        { name: '@emotion/core', approximateSize: 5000 },
      ],
    }

    const { getByText } = render(<PackageComposition info={info} />)

    expect(getByText('@emotion/core').closest('a')).toHaveAttribute(
      'href',
      '/result?p=@emotion/core'
    )
  })
})
