import React, { FC, Fragment, useCallback, useMemo, useState } from 'react'
// import { ExtensionPoint } from 'vtex.render-runtime'
import useProduct from 'vtex.product-context/useProduct'

import { useDailyPack } from '../../context/DailyPackContext'
import QuantitySelector from '../QuantitySelector'

const DOSAGE = 'DOSAGE'
const ELEMENT = 'ELEMENT'

const Controller: FC = () => {
  const { product, selectedItem } = useProduct()
  const [selectedQuantity, setSelectedQuantity] = useState(0)
  const { table, orderDosage, addOptions } = useDailyPack()

  const getPropertyValue = useCallback(
    propertyName => {
      const property = product?.properties.find(
        value => value.name.toUpperCase() === propertyName
      )
      if (!property || property.values.length === 0) {
        return null
      }

      return property.values[0]
    },
    [product]
  )

  const dosage = useMemo(() => getPropertyValue(DOSAGE), [getPropertyValue])
  const element = useMemo(() => getPropertyValue(ELEMENT), [getPropertyValue])

  const dailyDosage = useMemo(() => {
    if (!element) {
      return null
    }
    const data = table.find(
      value => value.element.toUpperCase() === element?.toUpperCase()
    )

    return data?.dailyDosage
  }, [table, element])

  const allowed = useMemo(() => {
    if (Number.isNaN(dailyDosage as any) || Number.isNaN(dosage as any)) {
      return true
    }

    return (
      Number(dosage) * selectedQuantity <
      Number(dailyDosage) - (orderDosage[element as string] || 0)
    )
  }, [dosage, dailyDosage, orderDosage, element, selectedQuantity])

  const handleClick: React.MouseEventHandler<HTMLDivElement> = e => {
    e.preventDefault()
    // Stop propagation so it doesn't trigger the Link component above
    e.stopPropagation()
  }

  return (
    <Fragment>
      {allowed ? null : (
        <div className="bg-red white">Max daily dosage reached!</div>
      )}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleClick}>
        <QuantitySelector
          skuId={selectedItem?.itemId}
          addOptions={addOptions}
          setSelectedQuantity={setSelectedQuantity}
          maxValue={allowed ? 'Infinity' : selectedQuantity}
        />
      </div>
    </Fragment>
  )
}

export default Controller
