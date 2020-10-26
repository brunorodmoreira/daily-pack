import React, { FC, useMemo } from 'react'
import { Button, withToast } from 'vtex.styleguide'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { applyModifiers } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import { useDailyPack } from '../../context/DailyPackContext'
import styles from './styles.css'

const AddPackToCartButton: FC<{ showToast: Function }> = ({ showToast }) => {
  const { addItem } = useOrderItems()
  const { options, composition } = useDailyPack()

  const { orderForm } = useOrderForm()

  const handleClick = () => {
    const ITEM_ID = '106'
    if (orderForm.items.some(item => item.id === ITEM_ID)) {
      showToast({
        message: 'Daily Pack already in your cart',
        duration: 5000,
      })

      return
    }

    const addedItem = addItem(
      [
        {
          index: orderForm.items.length,
          id: ITEM_ID,
          quantity: 1,
          seller: '1',
          options: [
            ...options.map(opt => ({
              assemblyId: 'dailypack_pills',
              seller: '1',
              quantity: opt.quantity,
              id: opt.id,
            })),
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

    if (addedItem) {
      showToast({
        message: 'Daily Pack added to cart',
        duration: 5000,
        action: {
          label: 'See cart',
          href: '/checkout',
          target: '_blank',
        },
      })
    }
  }

  const { minQuantity, maxQuantity } = composition

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

export default withToast(AddPackToCartButton)
