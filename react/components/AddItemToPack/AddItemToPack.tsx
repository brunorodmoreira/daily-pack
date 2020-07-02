import React, { FC, useMemo } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { Button } from 'vtex.styleguide'

import { useDailyPack } from '../../context/DailyPackContext'

const AddItemToPack: FC = () => {
  const { product, selectedItem } = useProduct()
  const { addItem, table, orderDosage } = useDailyPack()

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

  const dailyDosage = useMemo(
    () =>
      table.find(
        value => value.element.toLowerCase() === element?.toLowerCase()
      )?.dailyDosage,
    [table, element]
  )

  const isElementAllowed = useMemo(() => {
    return (
      typeof element === 'undefined' ||
      typeof dosage === 'undefined' ||
      (orderDosage[element] || 0) + Number(dosage) <= Number(dailyDosage)
    )
  }, [element, dosage, orderDosage, dailyDosage])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (isElementAllowed) {
      addItem({ id: selectedItem.itemId, element, dosage })
    }
  }

  return (
    <div>
      <Button
        variation="primary"
        onClick={handleClick}
        disabled={!isElementAllowed}
      >
        Add to Pack
      </Button>
      {!isElementAllowed ? (
        <div className="bg-red white">Daily dose limit reached</div>
      ) : null}
    </div>
  )
}

export default AddItemToPack
