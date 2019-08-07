const getBuiltPackageStats = require('package-build-stats')
const pkgVersions = require('pkg-versions')

const getPackageStat = name => {
  return getBuiltPackageStats(name)
}

const getPackageStatHistory = async name => {
  const versionsSet = await pkgVersions(name)
  const versions = [...versionsSet]

  const promises = versions.slice(-3).map(async version => {
    const stats = await getPackageStat(`${name}@${version}`)
    return {
      version,
      size: stats.size,
      gzip: stats.gzip,
    }
  })

  return Promise.all(promises)
}

module.exports = { getPackageStat, getPackageStatHistory }
