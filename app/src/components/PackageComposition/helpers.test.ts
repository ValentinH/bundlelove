import * as helpers from './helpers'

describe('PackageComposition helpers', () => {
  describe('getTreemapData', () => {
    it('should return the right data', async () => {
      const info = {
        name: 'react-easy-crop',
        version: '1.14.0',
        description: 'the best component ever',
        repository: 'https://github.com/ricardo-ch/react-easy-crop',
        size: 35000,
        gzip: 20000,
        dependencySizes: [
          { name: '@emotion/core', approximateSize: 6000 },
          { name: '@emotion/stylus', approximateSize: 15000 },
          { name: '@emotion/other', approximateSize: 7000 },
        ],
      }

      const result = helpers.getTreemapData(info)

      expect(result).toEqual([
        {
          height: 68.18181818181817,
          name: '@emotion/stylus',
          value: 15000,
          width: 78.57142857142857,
          x: 0,
          y: 0,
        },
        {
          height: 31.818181818181813,
          name: '@emotion/other',
          value: 7000,
          width: 78.57142857142857,
          x: 0,
          y: 68.18181818181817,
        },
        {
          height: 100,
          name: '@emotion/core',
          value: 6000,
          width: 21.42857142857143,
          x: 78.57142857142857,
          y: 0,
        },
      ])
    })
  })
})
