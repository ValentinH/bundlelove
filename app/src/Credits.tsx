import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Card, CardContent, Link, Typography } from '@material-ui/core'

const Credits: React.FC<RouteComponentProps> = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Credits</Typography>
        <p>
          This application is purely a clone of the awesome{' '}
          <Link href="https://bundlephobia.com">BundlePhobia</Link>.
        </p>
        <div>
          Logo icon made by{' '}
          <Link href="https://www.flaticon.com/authors/smashicons" title="Smashicons">
            Smashicons
          </Link>{' '}
          from{' '}
          <Link href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </Link>{' '}
          is licensed by{' '}
          <Link
            href="http://creativecommons.org/licenses/by/3.0/"
            title="Creative Commons BY 3.0"
            target="_blank"
          >
            CC 3.0 BY
          </Link>
          .
        </div>
      </CardContent>
    </Card>
  )
}

export default Credits
