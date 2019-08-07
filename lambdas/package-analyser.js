const getBuiltPackageStats = require('package-build-stats')

const options = {
  client: 'npm',
}

const getPackageStat = package => {
  return getBuiltPackageStats(package)
}

const getPackageStatHistory = package => {
  return getBuiltPackageStats(package)
}

module.exports = { getPackageStat, getPackageStatHistory }
