interface Option {
  id: string
  quantity: number
  metadata: {
    element?: string
    dosage?: number
    minQuantity?: number
    maxQuantity?: number
  }
}
