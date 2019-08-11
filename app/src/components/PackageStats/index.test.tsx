import React from 'react'
import { render, fireEvent, waitForElement } from 'test-utils'

import PackageStats from './index'

describe('PackageStats', () => {
  it('should display the right metrics', async () => {
    const info = {
      name: 'react-easy-crop',
      version: '1.14.0',
      description: 'whatever',
      repository: 'https://github.com/ricardo-ch/react-easy-crop',
      size: 34300,
      gzip: 12500,
      dependencySizes: [],
    }

    const { getByLabelText } = render(<PackageStats info={info} />)

    expect(getByLabelText('minified')).toHaveTextContent('33.5kB')
    expect(getByLabelText(/minified \+ gzipped/i)).toHaveTextContent('12.2kB')
    expect(getByLabelText(/2g edge/i)).toHaveTextContent('407ms')
    expect(getByLabelText(/emerging 3g/i)).toHaveTextContent('244ms')
  })
})
