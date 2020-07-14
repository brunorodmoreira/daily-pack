function reducer(
  state: Option[],
  action: {
    type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'CHANGE_QUANTITY'
    args: {
      id: string
      dosage?: string
      element?: string
      quantity?: number
    }
  }
): Option[] {
  const { args } = action
  switch (action.type) {
    case 'REMOVE_ITEM':
      return state.filter(opt => opt.id !== args.id)

    case 'CHANGE_QUANTITY':
      return state.some(value => value.id === args.id)
        ? state
            .map(opt => ({
              ...opt,
              quantity:
                opt.id === args.id && !!args.quantity
                  ? args.quantity
                  : opt.quantity,
            }))
            .filter(opt => !!opt.quantity)
        : [...state]

    case 'ADD_ITEM':
      if (state.some(value => value.id === args.id)) {
        return state.map(opt =>
          opt.id === args.id
            ? {
                ...opt,
                quantity: opt.quantity + 1,
              }
            : { ...opt }
        )
      }

      return [
        ...state,
        {
          id: args.id,
          quantity: 1,
          metadata: {
            element: args.element,
            dosage: Number(args.dosage) ?? null,
          },
        },
      ]

    default:
      return [...state]
  }
}

export default reducer
