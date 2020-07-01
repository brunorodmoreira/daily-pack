import React, { FC } from 'react'
import { useQuery } from 'react-apollo'

import ProductWrapper from './ProductWrapper'
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
    <ProductWrapper>
      <DailyPackContextProvider documents={data?.documents}>
        {children}
      </DailyPackContextProvider>
    </ProductWrapper>
  )
}

export default DailyPackWrapper
