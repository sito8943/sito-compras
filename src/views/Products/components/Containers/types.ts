import type { Dispatch, SetStateAction } from 'react'

// @sito/dashboard-app
import type { Action } from '@sito/dashboard'
import type { UseActionDialog } from '@sito/dashboard-app'

// lib
import type { CommonProductCategoryDto, ProductDto } from 'lib/entities'

// types
import type { ProductFormType } from '../../types'

export type ProductContainerPropsType = {
  checklistId: number
  categories: CommonProductCategoryDto[]
  getActions: (record: ProductDto) => Action<ProductDto>[]
  editAction: UseActionDialog<ProductDto, ProductFormType>
  showFilters?: boolean
  setShowFilters?: Dispatch<SetStateAction<boolean>>
}
