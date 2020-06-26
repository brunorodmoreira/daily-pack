import React, { FC, Fragment } from 'react'
import product from 'vtex.store-resources/QueryProduct'
import ProductContextProvider from 'vtex.product-context/ProductContextProvider'
import { useQuery } from 'react-apollo'

const SLUG = 'daily-pack'
const Wrapper: FC<{ query: Record<string, string> }> = ({
  query,
  children,
}) => {
  const { data } = useQuery(product, {
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
        {children}
      </ProductContextProvider>
    </Fragment>
  )
}

export default Wrapper
