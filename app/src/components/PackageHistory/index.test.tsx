import React from 'react'
import { render, fireEvent, waitForElement } from 'test-utils'
import * as api from 'services/api'

import PackageHistory from './index'

describe('PackageHistory', () => {
  it('should display the figure and let the user change the selected version', async () => {
    const history = [
      {
        version: '1.12.0',
        size: 32300,
        gzip: 14500,
      },
      {
        version: '1.13.0',
        size: 34300,
        gzip: 12500,
      },
      {
        version: '1.14.0',
        size: 3300,
        gzip: 10500,
      },
    ]
    jest.spyOn(api, 'getPackageHistory').mockResolvedValue(history)
    const onSelect = jest.fn()

    const { container, getByRole, getByText } = render(
      <PackageHistory name="react-easy-crop" onSelect={onSelect} />
    )

    await waitForElement(() => getByRole('figure'))

    // should render 3 bars
    expect(container.querySelectorAll('figure > div')).toHaveLength(3)

    fireEvent.click(getByText('1.12.0'))
    expect(onSelect).toHaveBeenCalledWith('1.12.0')
  })
})
