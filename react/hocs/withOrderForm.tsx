import React, { ComponentType, FC } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { OrderForm } from 'vtex.checkout-graphql'

interface WithOrderFormProps {
  orderForm: OrderForm
}

const WithOrderForm = <P extends object>(
  WrappedComponent: ComponentType<P>
): FC<P & WithOrderFormProps> => ({ ...props }: WithOrderFormProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { orderForm } = useOrderForm()

  return <WrappedComponent orderForm={orderForm} {...(props as P)} />
}

export default WithOrderForm
