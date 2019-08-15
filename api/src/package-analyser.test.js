const analyser = require('./package-analyser')

describe('package analyser', () => {
  describe('getVersionsForHistory', () => {
    test('should return the version when there is only one', () => {
      const versions = ['1.0.0']
      const result = analyser.getVersionsForHistory(versions)
      expect(result).toEqual(['1.0.0'])
    })

    test('should return the 3 last versions plus the previous major when current version is not a new major', () => {
      const versions = ['15.6.0', '15.6.1', '15.6.2', '16.0.0', '16.8.4', '16.8.5', '16.8.6']
      const result = analyser.getVersionsForHistory(versions)
      expect(result).toEqual(['15.6.2', '16.8.4', '16.8.5', '16.8.6'])
    })

    test('should return the 4 last versions when current version is a new major', () => {
      const versions = ['15.5.4', '15.5.5', '15.6.0', '15.6.1', '15.6.2', '16.0.0']
      const result = analyser.getVersionsForHistory(versions)
      expect(result).toEqual(['15.6.0', '15.6.1', '15.6.2', '16.0.0'])
    })

    test('should exclude non stable versions', () => {
      const versions = [
        '15.6.0',
        '15.6.1',
        '15.6.2',
        '16.0.0',
        '16.8.4',
        '16.8.5',
        '0.0.0-skfnj98',
        '16.8.6',
        '16.9.0-alpha.0',
        '16.9.0-rc.0',
      ]
      const result = analyser.getVersionsForHistory(versions)
      expect(result).toEqual(['15.6.2', '16.8.4', '16.8.5', '16.8.6'])
    })
  })
})
