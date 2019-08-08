const getBuiltPackageStats = require('package-build-stats')
const pkgVersions = require('pkg-versions')

const getPackageStat = name => {
  return getBuiltPackageStats(name)
}

const getVersionsForHistory = versions => {
  const stableVersions = versions.filter(v => v.match(/^\d+\.\d+\.\d+$/))
  const last4Versions = stableVersions.slice(-4)
  const [major] = stableVersions[stableVersions.length - 1].split('.')

  const previousMajor = stableVersions.reverse().find(v => !v.startsWith(`${major}.`))
  if (!previousMajor) {
    return last4Versions
  }

  if (last4Versions.includes(previousMajor)) {
    return last4Versions
  }

  return [previousMajor, ...last4Versions.slice(1)]
}

const getPackageStatHistory = async name => {
  try {
    const versionsSet = await pkgVersions(name)
    const versions = [...versionsSet]

    const promises = getVersionsForHistory(versions).map(async version => {
      const stats = await getPackageStat(`${name}@${version}`)
      return {
        version,
        size: stats.size,
        gzip: stats.gzip,
      }
    })

    return Promise.all(promises)
  } catch (e) {
    if (e.name === 'PackageNotFoundError') {
      return null
    }
    throw e
  }
}

module.exports = { getPackageStat, getPackageStatHistory, getVersionsForHistory }
