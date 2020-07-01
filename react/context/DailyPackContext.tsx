// eslint-disable-next-line import/order
import React, { FC, useContext, useMemo } from 'react'

// import useProduct from 'vtex.product-context/useProduct'

const DailyPackContext = React.createContext<{
  table: any[]
}>({
  table: [],
})

interface Field {
  key: string
  value: string
}

interface EntityDocument {
  fields: Field[]
}

interface Props {
  documents?: EntityDocument[]
  dailyPackProduct: any
}

function fieldsToObject(fields: Field[]): Record<string, string> {
  return fields.reduce((acc: Record<string, string>, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {})
}

export const DailyPackContextProvider: FC<Props> = ({
  documents,
  children,
}) => {
  const table = useMemo(
    () =>
      documents?.map(documentUnit => fieldsToObject(documentUnit.fields)) ?? [],
    [documents]
  )

  // eslint-disable-next-line no-console
  console.log(table)

  return (
    <DailyPackContext.Provider value={{ table }}>
      {children}
    </DailyPackContext.Provider>
  )
}

export const useDailyPack = () => {
  return useContext(DailyPackContext)
}

export default DailyPackContext
