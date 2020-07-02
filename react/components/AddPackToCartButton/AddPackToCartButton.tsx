import React, { useMemo } from 'react'
import { Button } from 'vtex.styleguide'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import useProduct from 'vtex.product-context/useProduct'
import { applyModifiers } from 'vtex.css-handles'

import { useDailyPack } from '../../context/DailyPackContext'
import styles from './styles.css'

const AddPackToCartButton = () => {
  const { product, selectedItem } = useProduct()
  const { addItem } = useOrderItems()
  const { options } = useDailyPack()

  const handleClick = () => {
    addItem(
      [
        {
          id: 106,
          quantity: 1,
          seller: '1',
          options: [
            ...options,
            {
              assemblyId: 'vtex.subscription.dailypack',
              inputValues: {
                'vtex.subscription.key.frequency': '1month',
              },
            },
          ],
        },
      ],
      {}
    )
  }

  const { minQuantity, maxQuantity } = useMemo(
    () =>
      product?.itemMetadata.items.find(
        value => value.id === selectedItem.itemId ?? 0
      )?.assemblyOptions?.[0].composition ?? {
        minQuantity: 0,
        maxQuantity: null,
      },
    [product, selectedItem]
  )

  const isAllowed = useMemo(
    () =>
      options.length >= minQuantity &&
      (maxQuantity !== null ? options.length < maxQuantity : true),
    [options, minQuantity, maxQuantity]
  )

  return (
    <div
      className={`${applyModifiers(
        styles.addPackContainer,
        isAllowed ? '' : 'disabled'
      )} flex justify-center`}
    >
      <Button block onClick={handleClick} disabled={!isAllowed}>
        <span className={styles.addPackButtonText}>Subscribe</span>
      </Button>
    </div>
  )
}

export default AddPackToCartButton
