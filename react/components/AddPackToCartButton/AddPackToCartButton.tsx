import React from 'react'
import { Button } from 'vtex.styleguide'
import { useOrderItems } from 'vtex.order-items/OrderItems'

import { useDailyPack } from '../../context/DailyPackContext'

const AddPackToCartButton = () => {
  const { addItem } = useOrderItems()
  const { options } = useDailyPack()

  const handleClick = () => {
    addItem(
      [
        {
          id: 106,
          quantity: 1,
          seller: '1',
          options,
        },
      ],
      {}
    )
  }
  return (
    <div>
      <span className="mb4">
        <Button variation="primary" onClick={handleClick}>
          SUBSCRIBE
        </Button>
      </span>
    </div>
  )
}

export default AddPackToCartButton
