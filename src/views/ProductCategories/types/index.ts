import type { FieldValues } from 'react-hook-form'

// @sito/dashboard
import type { Action } from '@sito/dashboard'
import type { ValidationError, FormDialogPropsType } from '@sito/dashboard-app'

// lib
import type { ProductCategoryDto } from 'lib/models'

export * from './actions'

export interface ProductCategoryCardPropsType extends ProductCategoryDto {
  actions: Action<ProductCategoryDto>[]
  onClick: (id: number) => void
  deleted: boolean
}

export interface ProductCategoryFormType
  extends Omit<
      ProductCategoryDto,
      'deleted' | 'createdAt' | 'updatedAt' | 'user'
    >,
    FieldValues {
  userId: number
}

export type ProductCategoryFormPropsType = FormDialogPropsType<
  ProductCategoryFormType,
  ValidationError
>

export type AddProductCategoryDialogPropsType = FormDialogPropsType<
  ProductCategoryFormType,
  ValidationError
>

export type EditProductCategoryDialogPropsType = FormDialogPropsType<
  ProductCategoryFormType,
  ValidationError
>

