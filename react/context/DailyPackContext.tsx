import React, { FC, useCallback, useContext, useMemo, useReducer } from 'react'
import useProduct from 'vtex.product-context/useProduct'

import reducer from './reducer'

const noop = () => {}

const DailyPackContext = React.createContext<{
  table: Array<Record<string, string>>
  options: Option[]
  composition: Composition
  orderDosage: Record<string, number>
  addItem: (args: {
    id: string
    dosage?: string
    element?: string
  }) => boolean | void
  removeItem: (args: {
    id: string
    dosage?: string
    element?: string
  }) => boolean | void
  changeQuantity: (
    args: { id: string; dosage?: string; element?: string },
    quantity: number
  ) => boolean | void
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
  const [options, dispatch] = useReducer(reducer, [])

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
      const maxDailyDosage = table.find(
        row => row.element?.toLowerCase() === args.element?.toLowerCase()
      )?.dailyDosage

      const maxQuantity = composition.items.find(value => value.id === args.id)
        ?.maxQuantity

      const quantity = options.find(opt => opt.id === args.id)?.quantity ?? 0

      if (typeof maxQuantity === 'number' && quantity >= maxQuantity) {
        return false
      }

      if (
        typeof maxDailyDosage === 'string' &&
        typeof args.dosage === 'string' &&
        Number(args.dosage) * quantity > Number(maxDailyDosage)
      ) {
        return false
      }

      dispatch({ type: 'ADD_ITEM', args })
      return true
    },
    [composition.items, options, table]
  )

  const removeItem = useCallback(
    (args: { id: string; dosage?: string; element?: string }) => {
      dispatch({ type: 'REMOVE_ITEM', args })
      return true
    },
    []
  )

  const changeQuantity = useCallback(
    (
      args: { id: string; dosage?: string; element?: string },
      quantity: number
    ) => {
      const maxDailyDosage = table.find(
        row => row.element?.toLowerCase() === args.element?.toLowerCase()
      )?.dailyDosage

      const maxQuantity = composition.items.find(value => value.id === args.id)
        ?.maxQuantity

      if (
        typeof maxQuantity === 'number' &&
        quantity > 0 &&
        quantity >= maxQuantity
      ) {
        return false
      }

      if (
        typeof maxDailyDosage === 'string' &&
        typeof args.dosage === 'string' &&
        Number(args.dosage) * quantity > Number(maxDailyDosage)
      ) {
        return false
      }

      dispatch({ type: 'CHANGE_QUANTITY', args: { ...args, quantity } })
      return true
    },
    [composition.items, table]
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
