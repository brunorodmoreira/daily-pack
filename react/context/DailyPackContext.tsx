import React, {
  FC,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react'
import useProduct from 'vtex.product-context/useProduct'

import reducer from './reducer'

const noop = () => {}

const DailyPackContext = React.createContext<{
  table: Array<Record<string, string>>
  options: Option[]
  composition: Composition
  orderDosage: Record<string, number>
  addItem: (args: { id: string; dosage?: string; element?: string }) => void
  removeItem: (args: { id: string; dosage?: string; element?: string }) => void
  changeQuantity: (
    args: { id: string; dosage?: string; element?: string },
    quantity: number
  ) => void
}>({
  table: [],
  options: [],
  composition: {} as Composition,
  orderDosage: {},
  addItem: noop,
  removeItem: noop,
  changeQuantity: noop,
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
  const { product, selectedItem } = useProduct()
  const [options, setOptions] = useState<Option[]>([])
  const [optionsReducer, dispatchOptions] = useReducer(reducer, [])
  // eslint-disable-next-line no-console
  console.log(optionsReducer)

  const composition = useMemo(() => {
    const { items = [], maxQuantity, minQuantity } =
      product?.itemMetadata.items
        .find(item => item.id === selectedItem.itemId)
        ?.assemblyOptions.find(opt => opt.id === 'dailypack_pills')
        ?.composition ?? ({} as Composition)
    return {
      minQuantity,
      maxQuantity,
      items: items.map((item: CompositionItem) => ({
        id: item.id,
        minQuantity: item.minQuantity,
        maxQuantity: item.maxQuantity,
      })),
    }
  }, [product, selectedItem])

  const table = useMemo(
    () =>
      documents?.map(documentUnit => fieldsToObject(documentUnit.fields)) ?? [],
    [documents]
  )

  const orderDosage = useMemo(() => {
    return options.reduce((acc, curr) => {
      const {
        quantity,
        metadata: { dosage, element },
      } = curr

      if (typeof element !== 'string' || typeof dosage !== 'number') {
        return acc
      }

      if (!acc[element]) {
        acc[element] = 0
      }

      acc[element] += dosage * quantity
      return acc
    }, {} as Record<string, number>)
  }, [options])

  const addItem = useCallback(
    (args: { id: string; dosage?: string; element?: string }) => {
      setOptions(prevState => {
        const newOptions = [...prevState]

        const opt = newOptions.find(value => value.id === args.id)

        const { minQuantity = 0, maxQuantity } =
          composition.items.find(item => item.id === args.id) ?? {}

        if (opt) {
          if (typeof maxQuantity !== 'number' || opt.quantity < maxQuantity) {
            opt.quantity++
          }

          return newOptions
        }

        return [
          ...newOptions,
          {
            id: args.id,
            quantity: 1,
            metadata: {
              element: args.element,
              dosage: Number(args.dosage) ?? null,
              minQuantity,
              maxQuantity,
            },
          },
        ]
      })

      dispatchOptions({ type: 'ADD_ITEM', args })
    },
    [composition.items]
  )

  const removeItem = useCallback(
    (args: { id: string; dosage?: string; element?: string }) => {
      const previousQuantity = options.find(value => value.id === args.id)
        ?.quantity

      if (!previousQuantity) {
        return
      }

      setOptions(prevState => prevState.filter(value => value.id !== args.id))
      dispatchOptions({ type: 'REMOVE_ITEM', args })
    },
    [options, setOptions]
  )

  const changeQuantity = useCallback(
    (
      args: { id: string; dosage?: string; element?: string },
      quantity: number
    ) => {
      if (quantity === 0) {
        removeItem(args)
      }

      const maxDailyDosage = table.find(
        row => row.element?.toLowerCase() === args.element?.toLowerCase()
      )?.dailyDosage

      if (
        typeof maxDailyDosage === 'string' &&
        typeof args.dosage === 'string' &&
        Number(args.dosage) * quantity > Number(maxDailyDosage)
      ) {
        return
      }

      setOptions(prevState => {
        const newOptions = [...prevState]

        const opt = newOptions.find(value => value.id === args.id)

        if (opt) {
          opt.quantity = quantity
          return newOptions
        }

        return prevState
      })

      dispatchOptions({ type: 'CHANGE_QUANTITY', args: { ...args, quantity } })
    },
    [table, removeItem, setOptions]
  )

  return (
    <DailyPackContext.Provider
      value={{
        table,
        options,
        composition,
        addItem,
        orderDosage,
        removeItem,
        changeQuantity,
      }}
    >
      {children}
    </DailyPackContext.Provider>
  )
}

export const useDailyPack = () => {
  return useContext(DailyPackContext)
}

export default DailyPackContext
