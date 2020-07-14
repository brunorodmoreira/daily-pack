interface CompositionItem {
  id: string
  minQuantity?: number
  maxQuantity?: number
}

interface AssemblyOption {
  id: string
  composition: {
    items: CompositionItem[]
    minQuantity: number
    maxQuantity: number
  }
}

interface ItemMetadataUnit {
  id: string
  assemblyOptions: AssemblyOption[]
}

interface Product {
  productId: string
  items: Array<{
    itemId: string
  }>
  properties: Array<{
    name: string
    values: string[]
  }>
  itemMetadata: { items: ItemMetadataUnit[] }
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
    selectedItem: { itemId: string }
  }

  const useProduct: () => ProductContext

  export default useProduct
}
