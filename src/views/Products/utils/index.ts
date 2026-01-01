// @sito/dashboard-app
import { formatForDatetimeLocal } from '@sito/dashboard-app'

import type { ProductDto, UpdateProductDto } from 'lib/entities'
import type { ProductFormType } from '../types'

export const formToDto = ({
  checklist,
  categories: category,
  ...data
}: ProductFormType): UpdateProductDto => {
  return {
    ...data,
  }
}

export const dtoToForm = (dto: ProductDto): ProductFormType => ({
  ...dto,
})

export const emptyProduct = (): ProductFormType => ({
  id: 0,
  initial: false,
  name: '',
  price: 0,
  userId: 0,
  count: 0,
  description: '',
  amount: 0,
  currencyId: 0,
  date: formatForDatetimeLocal(),
})

