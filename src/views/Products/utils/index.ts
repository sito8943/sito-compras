// @sito/dashboard-app
import { formatForDatetimeLocal } from '@sito/dashboard-app'

import type { ProductDto, UpdateProductDto, AddProductDto } from 'lib/entities'
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

export const formToAddDto = ({
  id: _id,
  createdAt: _c1,
  updatedAt: _c2,
  deleted: _c3,
  user: _user,
  currency: _currency,
  checklist: _checklist,
  categories: _categories,
  ...data
}: ProductFormType): AddProductDto => {
  const { name, price, count, userId, description, currencyId } = data as ProductFormType
  return {
    name,
    price,
    count,
    userId,
    description,
    currencyId,
  }
}

export const dtoToForm = (dto: ProductDto): ProductFormType => ({
  ...dto,
})

export const emptyProduct = (userId = 0): ProductFormType => ({
  id: 0,
  initial: false,
  name: '',
  price: 0,
  userId,
  count: 0,
  description: '',
  amount: 0,
  currencyId: 0,
  date: formatForDatetimeLocal(),
})
