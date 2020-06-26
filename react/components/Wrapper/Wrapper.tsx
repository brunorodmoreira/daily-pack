import React, { FC, Fragment } from 'react'
import { LoadingContextProvider } from 'vtex.render-runtime'
import product from 'vtex.store-resources/QueryProduct'
import ProductContextProvider from 'vtex.product-context/ProductContextProvider'
import { useQuery } from 'react-apollo'

const SLUG = 'daily-pack'
const Wrapper: FC<{ query: Record<string, string> }> = ({
  query,
  children,
}) => {
  const { data, loading } = useQuery(product, {
    variables: {
      slug: SLUG,
      skipCategoryTree: true,
      identifier: { field: 'id', value: '' },
    },
    errorPolicy: 'all',
  })

  return (
    <Fragment>
      <ProductContextProvider query={query} product={data?.product}>
        <LoadingContextProvider value={loading}>
          {children}
        </LoadingContextProvider>
      </ProductContextProvider>
    </Fragment>
  )
}

export default Wrapper
