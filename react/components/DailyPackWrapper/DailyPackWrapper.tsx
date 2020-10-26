import React, { FC } from 'react'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import { DailyPackContextProvider } from '../../context/DailyPackContext'
import DAILY_PACK_QUERY from '../../graphql/dailypack.graphql'

const DailyPackWrapper: FC = ({ children }) => {
  const { culture } = useRuntime()

  const { data } = useQuery(DAILY_PACK_QUERY, {
    variables: {
      where: `country=${culture.country}`,
    },
  })

  return (
    <DailyPackContextProvider documents={data?.documents}>
      {children}
    </DailyPackContextProvider>
  )
}

export default DailyPackWrapper
