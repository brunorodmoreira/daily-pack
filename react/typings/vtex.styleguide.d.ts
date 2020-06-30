declare module 'vtex.styleguide' {
  import React from 'react'

  export const Button: React.FC<{ variation: string; onClick: () => void }>
  export const NumericStepper: React.FC<{
    label: string
    size: string
    value: number
    maxValue: number | 'Infinity'
    onChange: (args: any) => void
  }>
}
