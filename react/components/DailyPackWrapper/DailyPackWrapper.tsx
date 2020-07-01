import React, { FC } from 'react'

import ProductWrapper from './ProductWrapper'

const DailyPackWrapper: FC = ({ children }) => {
  return <ProductWrapper>{children}</ProductWrapper>
}

export default DailyPackWrapper
