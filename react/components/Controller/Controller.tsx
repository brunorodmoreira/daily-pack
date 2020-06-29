import React, { FC, Fragment, useCallback, useMemo } from 'react'
import useProduct from 'vtex.product-context/useProduct'

// import { useDailyPack } from '../../context/DailyPackContext'

const DOSAGE = 'DOSAGE'
const ELEMENT = 'ELEMENT'
// const COUNTRY = 'CAN'

const Controller: FC = ({ children }) => {
  const { product } = useProduct()
  // const { table } = useDailyPack()

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

  getPropertyValue(DOSAGE)

  const dosage = useMemo(() => getPropertyValue(DOSAGE), [getPropertyValue])

  const element = useMemo(() => getPropertyValue(ELEMENT), [getPropertyValue])

  return (
    <Fragment>
      <div>{dosage}</div>
      <div>{element}</div>
      <div>{children}</div>
    </Fragment>
  )
}

export default Controller
