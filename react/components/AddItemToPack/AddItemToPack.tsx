import React, { FC, useMemo } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { Button } from 'vtex.styleguide'
import { applyModifiers } from 'vtex.css-handles'

import { useDailyPack } from '../../context/DailyPackContext'
import styles from './styles.css'

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
      typeof dailyDosage === 'undefined' ||
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
    <div
      className={`${applyModifiers(
        styles.addItemContainer,
        isElementAllowed ? '' : 'disabled'
      )} flex justify-center`}
    >
      <Button block onClick={handleClick}>
        <span className={styles.addItemButtonText}>Add to Pack</span>
      </Button>
    </div>
  )
}

export default AddItemToPack
