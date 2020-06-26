declare module 'vtex.product-context/ProductContextProvider' {
  import { FC } from 'react'

  interface Props {
    product: any
    query: Record<string, string>
  }

  const ProductContextProvider: FC<Props>
  export default ProductContextProvider
}
