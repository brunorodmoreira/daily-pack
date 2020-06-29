import React, { FC, Fragment } from 'react'
import { LoadingContextProvider } from 'vtex.render-runtime'
import ProductContextProvider from 'vtex.product-context/ProductContextProvider'
import { useQuery } from 'react-apollo'
import PRODUCT_QUERY from 'vtex.store-resources/QueryProduct'

import CONSUMPTION_QUERY from '../../graphql/consumption.graphql'
import DOCUMENTS_QUERY from '../../graphql/documents.graphql'
import { DailyPackContextProvider } from '../../context/DailyPackContext'
import WithOrderForm from '../../hocs/withOrderForm'

const SLUG = 'daily-pack'
const ACRONYM = 'dailypack'
const FIELDS = ['element', 'dailyDosage']
const SCHEMA = 'v1'
const COUNTRY = 'CAN'

const Wrapper: FC<{
  query: Record<string, string>
  orderForm: { items: Array<{ productId: string; quantity: number }> }
}> = ({ query, orderForm, children }) => {
  const productIds = orderForm
    ? orderForm.items.map(item => item.productId)
    : []

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
        where: `country=${COUNTRY}`,
      },
    }
  )

  const { data: consumptionData } = useQuery(CONSUMPTION_QUERY, {
    variables: {
      productIds,
    },
    skip: productIds.length === 0,
  })

  return (
    <Fragment>
      <ProductContextProvider query={query} product={productData?.product}>
        <DailyPackContextProvider
          documents={documentsData?.documents || []}
          productProperties={consumptionData?.productsByIdentifier || []}
          orderItems={orderForm.items || []}
        >
          <LoadingContextProvider value={productLoading && documentsLoading}>
            {children}
          </LoadingContextProvider>
        </DailyPackContextProvider>
      </ProductContextProvider>
    </Fragment>
  )
}

export default WithOrderForm(Wrapper)
