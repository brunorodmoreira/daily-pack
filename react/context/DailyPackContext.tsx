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
  blockedElements: string[]
  addItem: (args: { id: string; dosage: string; element: string }) => void
}>({
  table: [],
  options: [],
  blockedElements: [],
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
  const [orderDosage, setOrderDosage] = useState<Record<string, number>>({})
  const [blockedElements, setBlockedElements] = useState<string[]>([])

  const table = useMemo(
    () =>
      documents?.map(documentUnit => fieldsToObject(documentUnit.fields)) ?? [],
    [documents]
  )

  const addItem = useCallback(
    (args: { id: string; dosage: string; element: string }) => {
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

      setOrderDosage(prevState => ({
        ...prevState,
        [args.element]:
          (prevState[args.element] || 0) + Number(args.dosage) || 0,
      }))

      const dailyDosage = table.find(
        value => value.element.toLowerCase() === args.element?.toLowerCase()
      )?.dailyDosage

      setBlockedElements(
        Object.keys(orderDosage).filter(
          el =>
            !dailyDosage ||
            orderDosage[el] + Number(args.dosage) < Number(dailyDosage)
        )
      )
    },
    [setOptions, table, orderDosage]
  )

  return (
    <DailyPackContext.Provider
      value={{ table, options, addItem, blockedElements }}
    >
      {children}
    </DailyPackContext.Provider>
  )
}

export const useDailyPack = () => {
  return useContext(DailyPackContext)
}

export default DailyPackContext
