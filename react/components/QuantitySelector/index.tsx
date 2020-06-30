import React, { FC, useState } from 'react'
import { NumericStepper } from 'vtex.styleguide'

interface Props {
  skuId: string
  maxValue?: number | 'Infinity'
  addOptions: (args: any) => void
  setSelectedQuantity: (n: number) => void
}

const QuantitySelector: FC<Props> = ({
  skuId,
  setSelectedQuantity,
  maxValue,
  addOptions,
}) => {
  const [quantity, setQuantity] = useState(0)

  return (
    <div className="mb5 flex">
      <NumericStepper
        label="Quantity"
        size="small"
        value={quantity}
        maxValue={maxValue ?? 'Infinity'}
        onChange={event => {
          const { value } = event

          setQuantity(value)
          setSelectedQuantity(value)
          addOptions({ id: skuId, quantity: value })
        }}
      />
    </div>
  )
}

export default QuantitySelector
