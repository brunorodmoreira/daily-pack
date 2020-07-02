import React from 'react'
import { Button } from 'vtex.styleguide'
import { useOrderItems } from 'vtex.order-items/OrderItems'

import { useDailyPack } from '../../context/DailyPackContext'
import styles from './styles.css'

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
    <Button onClick={handleClick}>
      <div className={`${styles.container} flex justify-center`}>
        <span className={styles.buttonText}>Subscribe</span>
      </div>
    </Button>
  )
}

export default AddPackToCartButton
