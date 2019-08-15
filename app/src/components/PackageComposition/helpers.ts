import * as d3Hierarchy from 'd3-hierarchy'
import { PackageInfo } from 'services/api'

type Node = {
  name: string
  value: number
  children?: Node[]
}

type TreemapItem = {
  name: string
  value: number
  x: number
  y: number
  width: number
  height: number
}

export const getTreemapData = (info: PackageInfo) => {
  const data: Node = {
    name: 'root',
    value: 0,
    children: info.dependencySizes.map(({ name, approximateSize }) => ({
      name: name === info.name ? '(self)' : name,
      value: approximateSize,
    })),
  }

  const root = d3Hierarchy
    .hierarchy(data)
    .sum(d => d.value)
    // @ts-ignore ts definition is weird here
    .sort((a, b) => b.value - a.value)

  const treemap = d3Hierarchy.treemap<Node>().size([100, 100])

  const result = treemap(root).leaves()

  return result.map(
    (item): TreemapItem => ({
      name: item.data.name,
      value: item.value || 0,
      x: item.x0,
      y: item.y0,
      width: item.x1 - item.x0,
      height: item.y1 - item.y0,
    })
  )
}
