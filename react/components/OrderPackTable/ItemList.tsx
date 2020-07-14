import React, { FC } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'

interface Props {
  items: any[]
  onRemove: (...args: any) => void
  onQuantityChange: (...args: any) => void
}

const ItemList: FC<Props> = ({ items, onRemove, onQuantityChange }) => {
  return (
    <ExtensionPoint
      id="product-list"
      items={items}
      onRemove={onRemove}
      onQuantityChange={onQuantityChange}
    />
  )
}

export default React.memo(ItemList)
