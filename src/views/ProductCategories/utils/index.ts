import type { ProductCategoryDto, UpdateProductCategoryDto, AddProductCategoryDto } from 'lib/entities'
import type { ProductCategoryFormType } from '../types'

export const formToDto = ({
  id,
  name,
  description,
  userId,
}: ProductCategoryFormType): UpdateProductCategoryDto => {
  return {
    id,
    name,
    description,
    userId: userId,
  }
}

export const formToAddDto = ({
  id: _id,
  ...rest
}: ProductCategoryFormType): AddProductCategoryDto => {
  const { name, description, userId } = rest
  return { name, description, userId }
}

export const dtoToForm = (
  dto: ProductCategoryDto
): ProductCategoryFormType => ({
  ...dto,
  userId: dto.user?.id ?? 0,
})

export const emptyProductCategory = (userId = 0): ProductCategoryFormType => ({
  id: 0,
  name: '',
  description: '',
  userId,
})
