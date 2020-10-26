import React, { FC } from 'react'
import product from 'vtex.store-resources/QueryProduct'
import { LoadingContextProvider } from 'vtex.render-runtime'
import ProductContextProvider from 'vtex.product-context/ProductContextProvider'
import { useQuery } from 'react-apollo'

const SLUG = 'daily-pack'

const ProductWrapper: FC = ({ children }) => {
  const { data, loading } = useQuery(product, {
    variables: {
      slug: SLUG,
      skipCategoryTree: true,
      identifier: { field: 'id', value: '' },
    },
    errorPolicy: 'all',
  })
  return (
    <ProductContextProvider query={{}} product={data?.product}>
      <LoadingContextProvider value={loading}>
        {children}
      </LoadingContextProvider>
    </ProductContextProvider>
  )
}

export default ProductWrapper
