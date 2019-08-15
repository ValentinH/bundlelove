import React from 'react'
import { render, fireEvent, waitForElement } from 'test-utils'
import * as npms from 'services/npms'

import SearchInput from './index'

describe('SearchInput', () => {
  it('should display the suggestions after typing a text and be able to select one', async () => {
    jest.spyOn(npms, 'getPackagesSuggestions').mockResolvedValue([
      {
        package: { name: 'react', description: 'description react lib' },
        highlight: '<em>react</em>',
      },
      {
        package: { name: 'react-dom', description: 'description react-dom lib' },
        highlight: '<em>react</em>-dom',
      },
      {
        package: { name: 'react-easy-crop', description: 'description react-easy-crop lib' },
        highlight: '<em>react</em>-easy-crop',
      },
    ] as npms.Suggestion[])
    const onSelect = jest.fn()

    const { getByPlaceholderText, getByText, container } = render(
      <SearchInput onSelect={onSelect} />
    )

    const searchInput = getByPlaceholderText(/find package/i)
    fireEvent.focus(searchInput) // react-autosuggest only render the suggestions if it has focus
    fireEvent.change(searchInput, { target: { value: 'react' } })

    await waitForElement(() => getByText(/description react lib/))

    expect(container.querySelectorAll('li')).toHaveLength(3)

    fireEvent.click(getByText(/description react-easy-crop/i))

    expect(onSelect).toHaveBeenCalledWith('react-easy-crop')
  })
  it('should display the no result text when nothing is found', async () => {
    jest.spyOn(npms, 'getPackagesSuggestions').mockResolvedValue([])

    const { getByPlaceholderText, findByText, container } = render(
      <SearchInput onSelect={jest.fn()} />
    )

    const searchInput = getByPlaceholderText(/find package/i)
    fireEvent.focus(searchInput) // react-autosuggest only render the suggestions if it has focus
    fireEvent.change(searchInput, { target: { value: 'blablabla' } })

    await findByText(/no package found/i)

    expect(container.querySelectorAll('li')).toHaveLength(0)
  })
})
