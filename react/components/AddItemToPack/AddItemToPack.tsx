import React, { FC, useMemo } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { Button } from 'vtex.styleguide'

import { useDailyPack } from '../../context/DailyPackContext'

const AddItemToPack: FC = () => {
  const { product, selectedItem } = useProduct()
  const { addItem, blockedElements } = useDailyPack()

  const dosage = useMemo(
    () =>
      product?.properties.find(value => value.name.toLowerCase() === 'dosage')
        ?.values?.[0],
    [product]
  )
  const element = useMemo(
    () =>
      product?.properties.find(value => value.name.toLowerCase() === 'element')
        ?.values?.[0],
    [product]
  )

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    addItem({ id: selectedItem.itemId, element, dosage })
  }

  const isBlocked = useMemo(
    () => element === undefined || blockedElements.includes(element),
    [blockedElements, element]
  )

  return (
    <div>
      <Button variation="primary" onClick={handleClick} disabled={isBlocked}>
        Add to Pack
      </Button>
      {isBlocked ? (
        <div className="bg-red white">Daily dose limit reached</div>
      ) : null}
    </div>
  )
}

export default AddItemToPack
