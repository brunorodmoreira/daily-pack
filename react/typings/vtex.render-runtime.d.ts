import { ComponentType } from 'react'
import { ExtensionPointProps } from 'vtex.render-runtime'

declare module 'vtex.render-runtime' {
  import { FC } from 'react'

  export const ExtensionPoint: ComponentType<ExtensionPointProps>

  interface ChildBlockProps {
    id: string
  }

  export const ChildBlock: ComponentType<ChildBlockProps>
  export const useChildBlock = function ({ id: string }): object {}
  export const LoadingContextProvider: FC<{ value: boolean }>
}
