import { useTranslation } from 'react-i18next'

// @sito/dashboard-app
import { useAuth, useFormDialog } from '@sito/dashboard-app'

// providers
import { useManager } from 'providers'

// hooks
import { ProductCategoriesQueryKeys } from 'hooks'

// utils
import { dtoToForm, emptyProductCategory, formToDto } from '../utils'

// types
import type { ProductCategoryFormType } from '../types'

// lib
import type { UpdateProductCategoryDto, ProductCategoryDto } from 'lib/entities'

export function useEditProductCategoryDialog() {
  const { t } = useTranslation()

  const manager = useManager()
  const { account } = useAuth()

  return useFormDialog<
    ProductCategoryDto,
    UpdateProductCategoryDto,
    ProductCategoryDto,
    ProductCategoryFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: emptyProductCategory(account?.id ?? 0),
    getFunction: id => manager.ProductCategories.getById(id),
    mutationFn: data => manager.ProductCategories.update(data),
    onSuccessMessage: t('_pages:common.actions.add.successMessage'),
    title: t('_pages:checklists.forms.edit'),
    ...ProductCategoriesQueryKeys.all(),
  })
}

