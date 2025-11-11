import { useTranslation } from 'react-i18next'

// @sito/dashboard-app
import { useFormDialog } from '@sito/dashboard-app'

// providers
import { useManager } from 'providers'

// hooks
import { ProductCategoriesQueryKeys } from 'hooks'

// utils
import { dtoToForm, emptyProductCategory, formToDto } from '../utils'

// types
import type { ProductCategoryFormType } from '../types'

// lib
import type { UpdateProductCategoryDto, ProductCategoryDto } from 'lib/models'

export function useEditProductCategoryDialog() {
  const { t } = useTranslation()

  const manager = useManager()

  return useFormDialog<
    ProductCategoryDto,
    UpdateProductCategoryDto,
    ProductCategoryDto,
    ProductCategoryFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: emptyProductCategory,
    getFunction: id => manager.ProductCategories.getById(id),
    mutationFn: data => manager.ProductCategories.update(data),
    onSuccessMessage: t('_pages:common.actions.add.successMessage'),
    title: t('_pages:checklists.forms.edit'),
    ...ProductCategoriesQueryKeys.all(),
  })
}

