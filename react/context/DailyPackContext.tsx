import React, {
  FC,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react'
import { withToast } from 'vtex.styleguide'
import useProduct from 'vtex.product-context/useProduct'

interface Option {
  id: string
  quantity: number
  metadata?: {
    element?: string
    dosage?: number
    minQuantity?: number
    maxQuantity?: number
  }
}

const noop = () => {}

const DailyPackContext = React.createContext<{
  table: Array<Record<string, string>>
  options: Option[]
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

function reducer(
  state: Record<string, number>,
  action: {
    type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'CHANGE_QUANTITY'
    args: {
      dosage?: string
      element?: string
      quantity?: number
      previousQuantity?: number
    }
  }
) {
  const {
    args: { element, dosage: rawDosage, quantity, previousQuantity },
  } = action

  if (typeof element !== 'string' || typeof rawDosage !== 'string') {
    return state
  }

  const dosage = Number(rawDosage) || 0

  switch (action.type) {
    case 'CHANGE_QUANTITY':
      if (typeof quantity !== 'number') {
        return { ...state }
      }
      return {
        ...state,
        [element]: dosage * quantity,
      }

    case 'ADD_ITEM':
      return {
        ...state,
        [element]: (state[element] || 0) + dosage,
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        [element]: (state[element] || 0) - dosage * (previousQuantity ?? 0),
      }
    default:
      return { ...state }
  }
}

const ContextProvider: FC<Props & { showToast: (args: any) => void }> = ({
  documents,
  children,
  showToast,
}) => {
  const { product, selectedItem } = useProduct()
  const [options, setOptions] = useState<Option[]>([])
  const [orderDosage, dispatchOrderDosage] = useReducer(reducer, {})

  const composition = useMemo(
    () =>
      product?.itemMetadata.items
        .find(item => item.id === selectedItem.itemId)
        ?.assemblyOptions.find(opt => opt.id === 'dailypack_pills')
        ?.composition ?? { items: [] },
    [product, selectedItem]
  )

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

        const { minQuantity = 0, maxQuantity } =
          composition.items.find(item => item.id === args.id) ?? {}

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

      // dispatchOrderDosage({ type: 'ADD_ITEM', args: { ...args } })
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

      dispatchOrderDosage({
        type: 'REMOVE_ITEM',
        args: { ...args, previousQuantity },
      })
    },
    [options, setOptions, dispatchOrderDosage]
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
        row =>
          row.element?.toLocaleLowerCase() === args.element?.toLocaleLowerCase()
      )?.dailyDosage

      if (
        typeof maxDailyDosage === 'string' &&
        typeof args.dosage === 'string' &&
        Number(args.dosage) * quantity > Number(maxDailyDosage)
      ) {
        showToast({
          message: `Invalid quantity for ${args.element} element`,
          duration: 5000,
        })
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

      dispatchOrderDosage({
        type: 'CHANGE_QUANTITY',
        args: { ...args, quantity },
      })
    },
    [table, removeItem, setOptions, dispatchOrderDosage, showToast]
  )

  return (
    <DailyPackContext.Provider
      value={{
        table,
        options,
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

export const DailyPackContextProvider = withToast(ContextProvider) as FC<Props>

export const useDailyPack = () => {
  return useContext(DailyPackContext)
}

export default DailyPackContext
