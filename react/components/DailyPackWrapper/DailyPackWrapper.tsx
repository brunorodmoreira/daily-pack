import React, { FC } from 'react'
import { useQuery } from 'react-apollo'

import { DailyPackContextProvider } from '../../context/DailyPackContext'
import DAILY_PACK_QUERY from '../../graphql/dailypack.graphql'

const COUNTRY = 'CAN'

const DailyPackWrapper: FC = ({ children }) => {
  const { data } = useQuery(DAILY_PACK_QUERY, {
    variables: {
      where: `country=${COUNTRY}`,
    },
  })

  return (
    <DailyPackContextProvider documents={data?.documents}>
      {children}
    </DailyPackContextProvider>
  )
}

export default DailyPackWrapper
