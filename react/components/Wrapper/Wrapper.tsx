import React, { FC, Fragment } from 'react'
import { LoadingContextProvider } from 'vtex.render-runtime'
import ProductContextProvider from 'vtex.product-context/ProductContextProvider'
import { useQuery } from 'react-apollo'
import PRODUCT_QUERY from 'vtex.store-resources/QueryProduct'

import DOCUMENTS_QUERY from '../../graphql/documents.graphql'
import { DailyPackContextProvider } from '../../context/DailyPackContext'

const SLUG = 'daily-pack'
const ACRONYM = 'dailypack'
const FIELDS = ['country', 'element', 'dailyDosage']
const SCHEMA = 'v1'

const Wrapper: FC<{ query: Record<string, string> }> = ({
  query,
  children,
}) => {
  const { data: productData, loading: productLoading } = useQuery(
    PRODUCT_QUERY,
    {
      variables: {
        slug: SLUG,
        skipCategoryTree: true,
        identifier: { field: 'id', value: '' },
      },
      errorPolicy: 'all',
    }
  )

  const { data: documentsData, loading: documentsLoading } = useQuery(
    DOCUMENTS_QUERY,
    {
      variables: {
        acronym: ACRONYM,
        schema: SCHEMA,
        fields: FIELDS,
      },
    }
  )

  return (
    <Fragment>
      <ProductContextProvider query={query} product={productData?.product}>
        <DailyPackContextProvider documents={documentsData?.documents}>
          <LoadingContextProvider value={productLoading && documentsLoading}>
            {children}
          </LoadingContextProvider>
        </DailyPackContextProvider>
      </ProductContextProvider>
    </Fragment>
  )
}

export default Wrapper
