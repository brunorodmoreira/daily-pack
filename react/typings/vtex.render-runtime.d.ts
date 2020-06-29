import { ComponentType } from 'react'
import { ExtensionPointProps } from 'vtex.render-runtime'

declare module 'vtex.render-runtime' {
  import { FC } from 'react'

  interface ChildBlockProps {
    id: string
  }

  export const ExtensionPoint: ComponentType<ExtensionPointProps>
  export const useChildBlock = function ({ id: string }): object {}
  export const LoadingContextProvider: FC<{ value: boolean }>
}
