import React, { FC } from 'react'

import ProductWrapper from './ProductWrapper'
import DailyPackWrapper from './DailyPackWrapper'

const Wrapper: FC = ({ children }) => {
  return (
    <ProductWrapper>
      <DailyPackWrapper>{children}</DailyPackWrapper>
    </ProductWrapper>
  )
}

export default Wrapper
