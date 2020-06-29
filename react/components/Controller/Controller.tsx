import React, { FC, Fragment, useCallback, useMemo } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import useProduct from 'vtex.product-context/useProduct'

import { useDailyPack } from '../../context/DailyPackContext'

const DOSAGE = 'DOSAGE'
const ELEMENT = 'ELEMENT'

const Controller: FC = () => {
  const { product } = useProduct()
  const { table } = useDailyPack()

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

    return Number(dosage) <= Number(dailyDosage)
  }, [dosage, dailyDosage])

  return (
    <Fragment>
      <div>{JSON.stringify(product?.properties)}</div>
      {allowed ? (
        <ExtensionPoint id="add-to-cart-button" />
      ) : (
        <div className="bg-red white">Daily Dosage Reached</div>
      )}
    </Fragment>
  )
}

export default Controller
