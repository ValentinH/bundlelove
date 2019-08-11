const got = require('got')
const getBuiltPackageStats = require('package-build-stats')
const pkgVersions = require('pkg-versions')

const getPackageInfo = async (name, version = '') => {
  const { body } = await got(`https://registry.yarnpkg.com/${name}/${version}`, { json: true })

  if (version) {
    return {
      name: body.name,
      version: body.version,
      repository: body.repository.url,
      description: body.description,
    }
  }
  return {
    name: body.name,
    version: body['dist-tags'].latest,
    repository: body.repository.url,
    description: body.description,
  }
}

const getPackageStat = async (name, version) => {
  let info = null
  try {
    info = await getPackageInfo(name, version)
  } catch (e) {
    return null
  }

  // const sizeStats = await getBuiltPackageStats(`${info.name}@${info.version}`)

  return {
    ...info,
    size: 30000, //sizeStats.size,
    gzip: 20000, // sizeStats.gzip,
    // dependencySizes: sizeStats.dependencySizes,
  }
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
  return [
    {
      version: '1.12.0',
      size: 34970,
      gzip: 10605,
    },
    {
      version: '1.13.0',
      size: 38413,
      gzip: 12717,
    },
    {
      version: '1.13.1',
      size: 33455,
      gzip: 11724,
    },
    {
      version: '1.14.0',
      size: 40504,
      gzip: 18746,
    },
  ]
  try {
    const versionsSet = await pkgVersions(name)
    const versions = [...versionsSet]

    const promises = getVersionsForHistory(versions).map(async version => {
      const stats = await getPackageStat(name, version)
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
