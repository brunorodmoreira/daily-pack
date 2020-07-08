declare module 'vtex.styleguide' {
  import React from 'react'

  export const Button: React.FC<{
    onClick: (any) => void
    block?: boolean
    disabled?: boolean
  }>

  export const withToast = function (args: any): React.FC {}
}
