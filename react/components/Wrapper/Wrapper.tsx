import React, { FC, Fragment } from 'react'
import { LoadingContextProvider } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'

import DOCUMENTS_QUERY from '../../graphql/documents.graphql'
import { DailyPackContextProvider } from '../../context/DailyPackContext'

const ACRONYM = 'dailypack'
const FIELDS = ['element', 'dailyDosage']
const SCHEMA = 'v1'
const COUNTRY = 'CAN'

const Wrapper: FC<{
  query: Record<string, string>
  orderForm: { items: Array<{ productId: string; quantity: number }> }
}> = ({ children }) => {
  const { data: documentsData, loading: documentsLoading } = useQuery(
    DOCUMENTS_QUERY,
    {
      variables: {
        acronym: ACRONYM,
        schema: SCHEMA,
        fields: FIELDS,
        where: `country=${COUNTRY}`,
      },
    }
  )

  return (
    <Fragment>
      <DailyPackContextProvider documents={documentsData?.documents || []}>
        <LoadingContextProvider value={documentsLoading}>
          {children}
        </LoadingContextProvider>
      </DailyPackContextProvider>
    </Fragment>
  )
}

export default Wrapper
