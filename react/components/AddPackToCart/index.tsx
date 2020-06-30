import React from 'react'
import { Button } from 'vtex.styleguide'
import AddToCart from 'vtex.checkout-resources/MutationAddToCart'
import { useMutation } from 'react-apollo'

import { useDailyPack } from '../../context/DailyPackContext'

const AddPackToCart = () => {
  const { options } = useDailyPack()
  const [addItem] = useMutation(AddToCart, {
    variables: {
      items: [
        {
          id: 106,
          quantity: 1,
          seller: '1',
          options,
        },
      ],
    },
  })

  return (
    <div>
      <span className="mb4">
        <Button variation="primary" onClick={() => addItem()}>
          Add Pack to Cart
        </Button>
      </span>
    </div>
  )
}

export default AddPackToCart
