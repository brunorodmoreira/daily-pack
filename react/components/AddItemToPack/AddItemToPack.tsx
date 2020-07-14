import React, { FC, useMemo } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { Button, withToast } from 'vtex.styleguide'
import { applyModifiers } from 'vtex.css-handles'

import { useDailyPack } from '../../context/DailyPackContext'
import styles from './styles.css'

const AddItemToPack: FC<{ showToast: Function }> = ({ showToast }) => {
  const { product, selectedItem } = useProduct()
  const { addItem, table, orderDosage, options, composition } = useDailyPack()

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

  const maxDailyDosage = useMemo(() => {
    const dailyDosage = table.find(
      value => value.element.toLowerCase() === element?.toLowerCase()
    )?.dailyDosage
    return Number(dailyDosage) || null
  }, [table, element])

  const quantity = useMemo(
    () => options.find(opt => opt.id === selectedItem.itemId)?.quantity ?? 0,
    [options, selectedItem.itemId]
  )

  const maxQuantity = useMemo(
    () =>
      composition.items.find(value => value.id === selectedItem.itemId)
        ?.maxQuantity,
    [composition.items, selectedItem.itemId]
  )

  const isQuantityAllowed = useMemo(
    () => typeof maxQuantity !== 'number' || quantity < maxQuantity,
    [maxQuantity, quantity]
  )

  const isElementAllowed = useMemo(() => {
    return (
      typeof element !== 'string' ||
      typeof dosage !== 'string' ||
      typeof maxDailyDosage !== 'number' ||
      (orderDosage[element] || 0) + Number(dosage) <= maxDailyDosage
    )
  }, [element, dosage, orderDosage, maxDailyDosage])

  const isBlocked = !(isQuantityAllowed && isElementAllowed)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if (!isBlocked) {
      addItem({ id: selectedItem.itemId, element, dosage })
      showToast({
        message: 'Item added to pack',
        duration: 5000,
      })
    }
  }

  return (
    <div
      className={`${applyModifiers(
        styles.addItemContainer,
        isBlocked ? 'disabled' : ''
      )} flex justify-center`}
    >
      <Button block onClick={handleClick}>
        <span className={styles.addItemButtonText}>Add to Pack</span>
      </Button>
    </div>
  )
}

export default withToast(AddItemToPack)
