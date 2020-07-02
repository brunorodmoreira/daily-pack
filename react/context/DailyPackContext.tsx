import React, { FC, useCallback, useContext, useMemo, useState } from 'react'

interface Option {
  assemblyId: string
  id: string
  quantity: number
  seller: string
}

const noop = () => {}

const DailyPackContext = React.createContext<{
  table: any[]
  options: Option[]
  orderDosage: Record<string, number>
  addItem: (args: { id: string; dosage?: string; element?: string }) => void
  removeItem: (args: { id: string; dosage?: string; element?: string }) => void
}>({
  table: [],
  options: [],
  orderDosage: {},
  addItem: noop,
  removeItem: noop,
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

  const table = useMemo(
    () =>
      documents?.map(documentUnit => fieldsToObject(documentUnit.fields)) ?? [],
    [documents]
  )

  const addItem = useCallback(
    (args: { id: string; dosage?: string; element?: string }) => {
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

      if (typeof args.element !== 'string' || typeof args.dosage !== 'string') {
        return
      }

      setOrderDosage(prevState => ({
        ...prevState,
        [args.element as string]:
          (prevState[args.element as string] || 0) + Number(args.dosage) || 0,
      }))
    },
    [setOptions]
  )

  const removeItem = useCallback(
    (args: { id: string; dosage?: string; element?: string }) => {
      const previousQuantity = options.find(value => value.id === args.id)
        ?.quantity

      if (!previousQuantity) {
        return
      }

      setOptions(prevState => prevState.filter(value => value.id !== args.id))

      if (typeof args.element !== 'string' || typeof args.dosage !== 'string') {
        return
      }

      setOrderDosage(prevState => ({
        ...prevState,
        [args.element as string]:
          (prevState[args.element as string] || 0) -
            Number(args.dosage) * previousQuantity || 0,
      }))
    },
    [options, setOptions]
  )

  return (
    <DailyPackContext.Provider
      value={{ table, options, addItem, orderDosage, removeItem }}
    >
      {children}
    </DailyPackContext.Provider>
  )
}

export const useDailyPack = () => {
  return useContext(DailyPackContext)
}

export default DailyPackContext
