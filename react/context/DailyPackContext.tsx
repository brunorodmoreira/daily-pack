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
}

function fieldsToObject(fields: Field[]): Record<string, string> {
  return fields.reduce((acc: Record<string, string>, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {})
}

const DailyPackContext = React.createContext<{
  table: Array<Record<string, string>>
}>({ table: [] })

export const DailyPackContextProvider: FC<Props> = ({
  documents,
  children,
}) => {
  const parsedDocuments:
    | Array<Record<string, string>>
    | undefined = useMemo(
    () => documents?.map(value => fieldsToObject(value.fields)),
    [documents]
  )

  return (
    <DailyPackContext.Provider value={{ table: parsedDocuments }}>
      {children}
    </DailyPackContext.Provider>
  )
}

export const useDailyPack = () => {
  return useContext(DailyPackContext)
}

export default DailyPackContext
