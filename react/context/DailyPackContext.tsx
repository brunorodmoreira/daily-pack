import React, { FC, useContext, useMemo } from 'react'

interface Field {
  key: string
  value: string
}

interface EntityDocument {
  fields: Field[]
}

interface Props {
  documents: EntityDocument[]
  productProperties: Product[]
  orderItems: Array<{ productId: string; quantity: number }>
}

function fieldsToObject(fields: Field[]): Record<string, string> {
  return fields.reduce((acc: Record<string, string>, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {})
}

const DailyPackContext = React.createContext<{
  table: Array<Record<string, string>>
  orderDosage: Record<string, number>
}>({ table: [], orderDosage: {} })

export const DailyPackContextProvider: FC<Props> = ({
  documents,
  productProperties,
  orderItems,
  children,
}) => {
  const parsedDocuments = useMemo(
    () => documents?.map(value => fieldsToObject(value.fields)),
    [documents]
  )

  const orderDosage = useMemo(() => {
    return orderItems.reduce((acc: Record<string, number>, item) => {
      const value = productProperties.find(
        product => product.productId === item.productId
      )

      const dosage = value?.properties.find(
        property => property.name.toUpperCase() === 'DOSAGE'
      )?.values?.[0]

      const element = value?.properties.find(
        property => property.name.toUpperCase() === 'ELEMENT'
      )?.values?.[0]

      if (!dosage || !element) {
        return acc
      }

      if (acc[element] === undefined) {
        acc[element] = Number(dosage) * item.quantity
        return acc
      }

      acc[element] += Number(dosage) * item.quantity
      return acc
    }, {})
  }, [orderItems, productProperties])

  return (
    <DailyPackContext.Provider value={{ table: parsedDocuments, orderDosage }}>
      Current Dosage: {JSON.stringify(orderDosage, null, 3)}
      {children}
    </DailyPackContext.Provider>
  )
}

export const useDailyPack = () => {
  return useContext(DailyPackContext)
}

export default DailyPackContext
