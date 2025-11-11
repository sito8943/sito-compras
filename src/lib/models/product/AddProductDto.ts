import type { CommonProductCategoryDto } from '../productCategory'

export type AddProductDto = {
  name: string
  price: number
  count: number
  checklistId: number
  category: CommonProductCategoryDto | null
  userId: number
  description: string
}

