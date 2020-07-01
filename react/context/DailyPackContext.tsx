import React, { FC, useCallback, useContext, useMemo, useState } from 'react'

interface Option {
  assemblyId: string
  id: string
  quantity: number
  seller: string
}

const DailyPackContext = React.createContext<{
  table: any[]
  options: Option[]
  addItem: (args: { id: string }) => void
}>({
  table: [],
  options: [],
  addItem: () => {},
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
  const [options, setOptions] = useState<Option[]>([])

  const addItem = useCallback(
    (args: { id: string }) => {
      setOptions(prevState => {
        const newOptions = [...prevState]

        const opt = newOptions.find(value => value.id === args.id)

        if (opt) {
          opt.quantity++
          return newOptions
        }

        return [
          ...newOptions,
          {
            assemblyId: 'dailypack_pills',
            seller: '1',
            quantity: 1,
            id: args.id,
          },
        ]
      })
    },
    [setOptions]
  )

  const table = useMemo(
    () =>
      documents?.map(documentUnit => fieldsToObject(documentUnit.fields)) ?? [],
    [documents]
  )

  // eslint-disable-next-line no-console
  console.log(table)

  return (
    <DailyPackContext.Provider value={{ table, options, addItem }}>
      {children}
    </DailyPackContext.Provider>
  )
}

export const useDailyPack = () => {
  return useContext(DailyPackContext)
}

export default DailyPackContext
