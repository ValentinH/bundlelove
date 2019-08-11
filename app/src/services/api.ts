import ky from 'ky'
import * as packageUtils from 'utils/package'

export interface PackageInfo {
  name: string
  version: string
  description: string
  repository: string
  size: number
  gzip: number
  dependencySizes: Array<{
    name: string
    approximateSize: number
  }>
}

interface PackageHistoryItem {
  version: string
  size: number
  gzip: number
}

export type PackageHistory = PackageHistoryItem[]

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://ka3y63g6v3.execute-api.eu-west-2.amazonaws.com/prod'
    : 'http://localhost:3001'

export const getPackageInfo = async (query: string) => {
  const { name, version } = packageUtils.getNameAndVersion(query)
  try {
    const info: PackageInfo = await ky
      .get(`${API_URL}/stats`, {
        searchParams: {
          name,
          ...(version && { version }),
        },
      })
      .json()
    return info
  } catch (e) {
    return null
  }
}

export const getPackageHistory = async (name: string) => {
  try {
    const history: PackageHistory = await ky
      .get(`${API_URL}/history`, {
        searchParams: {
          name,
        },
      })
      .json()
    return history
  } catch (e) {
    return null
  }
}