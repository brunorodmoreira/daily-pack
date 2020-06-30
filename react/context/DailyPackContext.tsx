import React, { FC, useCallback, useContext, useMemo, useState } from 'react'
import { useQuery } from 'react-apollo'

import CONSUMPTION_QUERY from '../graphql/consumption.graphql'

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

interface AssemblyOption {
  assemblyId: string
  id: string
  quantity: number
  seller: string
}

const DailyPackContext = React.createContext<{
  table: Array<Record<string, string>>
  orderDosage: Record<string, number>
  options: AssemblyOption[]
  addOptions: (args: { id: string; quantity: number }) => void
}>({ table: [], orderDosage: {}, options: [], addOptions: () => {} })

export const DailyPackContextProvider: FC<Props> = ({
  documents,
  children,
}) => {
  const [options, setOptions] = useState<AssemblyOption[]>([])

  const productIds = useMemo(() => options.map(value => value.id), [options])

  const { data } = useQuery(CONSUMPTION_QUERY, {
    variables: {
      productIds,
    },
    skip: productIds.length === 0,
  })

  const productProperties: Product[] = useMemo(
    () => data?.productsByIdentifier || [],
    [data]
  )

  const addOptions = useCallback(args => {
    setOptions((prevState: AssemblyOption[]) => [
      { assemblyId: 'dailypack_pills', seller: '1', ...args },
      ...prevState.filter(value => value.id !== args.id),
    ])
  }, [])

  const parsedDocuments = useMemo(
    () => documents?.map(value => fieldsToObject(value.fields)),
    [documents]
  )

  const orderDosage = useMemo(() => {
    if (!options.length) {
      return {}
    }

    return options.reduce((acc: Record<string, number>, item) => {
      const value = productProperties.find((product: Product) =>
        product.items.some(i => i.itemId === item.id)
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
  }, [productProperties, options])

  return (
    <DailyPackContext.Provider
      value={{ table: parsedDocuments, orderDosage, options, addOptions }}
    >
      Current Dosage: {JSON.stringify(orderDosage, null, 3)}
      {children}
    </DailyPackContext.Provider>
  )
}

export const useDailyPack = () => {
  return useContext(DailyPackContext)
}

export default DailyPackContext
