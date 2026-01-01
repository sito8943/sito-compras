import type { FieldValues } from 'react-hook-form'

// @sito/dashboard
import type { Action } from '@sito/dashboard'
import type {
  BaseEntityDto,
  UseActionDialog,
  ValidationError,
  FormDialogPropsType,
} from '@sito/dashboard-app'

// types
import type { CommonChecklistDto, ProductDto } from 'lib/entities'

export interface ProductCardPropsType extends ProductDto {
  actions: Action<ProductDto>[]
  onClick: (id: number) => void
  deleted: boolean
}

export interface ProductFormType
  extends Omit<
      ProductDto,
      'deleted' | 'createdAt' | 'updatedAt' | 'user' | 'checklist'
    >,
    FieldValues {}

export type ProductFormPropsType = FormDialogPropsType<
  ProductFormType,
  ValidationError
> & {
  lockCategory?: boolean
  lockChecklist?: boolean
  checklist?: CommonChecklistDto | null
}

export interface TriggerProductPropsType extends ProductFormPropsType {
  openDialog: (id?: number) => void
}

export type AddProductDialogPropsType = TriggerProductPropsType

export type EditProductDialogPropsType = TriggerProductPropsType

export type UseAddProductActionDialog<TDto extends BaseEntityDto> =
  UseActionDialog<TDto, ProductFormType> & {
    lockCategory?: boolean
    lockChecklist?: boolean
  }

export type UseAddProductDialogActionPropsType = {
  checklist: CommonChecklistDto | null
}
