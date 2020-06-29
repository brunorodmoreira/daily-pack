interface Product {
  properties: Array<{
    name: string
    values: string[]
  }>
}

declare module 'vtex.product-context/ProductContextProvider' {
  import { FC } from 'react'

  interface Props {
    product: Product
    query: Record<string, string>
  }

  const ProductContextProvider: FC<Props>
  export default ProductContextProvider
}

declare module 'vtex.product-context/useProduct' {
  interface ProductContext {
    product: Product | null
  }

  const useProduct: () => ProductContext

  export default useProduct
}
