// @sito/dashboard-app
import { formatForDatetimeLocal } from '@sito/dashboard-app'

import type {
  CommonChecklistDto,
  ProductDto,
  UpdateProductDto,
} from 'lib/models'
import type { ProductFormType } from '../types'

export const formToDto = ({
  checklist,
  categories: category,
  ...data
}: ProductFormType): UpdateProductDto => {
  return {
    ...data,
    checklistId: checklist?.id ?? 0,
    category: category ?? 0,
  }
}

export const dtoToForm = (dto: ProductDto): ProductFormType => ({
  ...dto,
  checklistId: dto.checklist?.id ?? 0,
  category: dto.category ?? null,
})

export const emptyProduct = (
  checklist: CommonChecklistDto | null = null
): ProductFormType => ({
  id: 0,
  initial: false,
  name: '',
  price: 0,
  userId: 0,
  count: 0,
  description: '',
  checklistId: checklist?.id ?? 0,
  category: null,
  amount: 0,
  date: formatForDatetimeLocal(),
})

