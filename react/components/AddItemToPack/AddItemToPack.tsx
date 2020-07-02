import React, { FC, useMemo } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { Button } from 'vtex.styleguide'

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
    <Button onClick={handleClick} disabled={!isElementAllowed}>
      <div className={`${styles.container} flex justify-center`}>
        <span className={styles.buttonText}>Add to Pack</span>
      </div>
    </Button>
  )
}

export default AddItemToPack
