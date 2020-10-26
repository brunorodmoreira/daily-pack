import React, { FC, useCallback, useMemo } from 'react'
import { useQuery } from 'react-apollo'

import { useDailyPack } from '../../context/DailyPackContext'
import PRODUCTS_QUERY from '../../graphql/products.graphql'
import ItemList from './ItemList'

const getUniqueId = (itemId: string, element: string, dosage: string): string =>
  btoa(JSON.stringify({ id: itemId, element, dosage }))

const parseUniqueId = (uniqueId: string): any => JSON.parse(atob(uniqueId))

const OrderPackTable: FC = () => {
  const { options, removeItem, changeQuantity } = useDailyPack()

  const itemIds = useMemo(() => options.map(value => value.id), [options])

  const { data } = useQuery(PRODUCTS_QUERY, {
    variables: {
      productIds: itemIds,
    },
    skip: itemIds.length === 0,
  })

  const items = useMemo(() => {
    return (
      data?.productsByIdentifier.map((value: any) => {
        const item = value.items?.[0]
        const imageUrl = item?.images?.[0].imageUrl

        const dosage = value?.properties.find(
          (prop: { name: string }) => prop.name.toLowerCase() === 'dosage'
        )?.values?.[0]

        const element = value?.properties.find(
          (prop: { name: string }) => prop.name.toLowerCase() === 'element'
        )?.values?.[0]

        const price = value.priceRange.sellingPrice.lowPrice * 100
        return {
          id: value.productId,
          name: value.productName,
          availability: 'available',
          quantity: options.find(opt => opt.id === item.itemId)?.quantity,
          skuName: item?.name,
          imageUrls: {
            at1x: imageUrl,
            at2x: imageUrl,
            at3x: imageUrl,
          },
          price,
          sellingPrice: price,
          uniqueId: getUniqueId(item.itemId, element, dosage),
        }
      }) || []
    )
  }, [data, options])

  const onRemove = useCallback(
    (uniqueId: string) => removeItem(parseUniqueId(uniqueId)),
    [removeItem]
  )

  const onQuantityChange = useCallback(
    (uniqueId: string, quantity: number) =>
      changeQuantity(parseUniqueId(uniqueId), quantity),
    [changeQuantity]
  )
  return (
    <ItemList
      items={items}
      onRemove={onRemove}
      onQuantityChange={onQuantityChange}
    />
  )
}

export default OrderPackTable
