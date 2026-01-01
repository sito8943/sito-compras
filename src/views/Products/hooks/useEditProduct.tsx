import { useTranslation } from 'react-i18next'

// @sito/dashboard-app
import type { UseActionDialog } from '@sito/dashboard-app'
import { useEditAction, useFormDialog } from '@sito/dashboard-app'

// providers
import { useManager } from 'providers'

// hooks
import { ProductsQueryKeys } from 'hooks'

// utils
import { dtoToForm, emptyProduct, formToDto } from '../utils'

// lib
import type { UpdateProductDto, ProductDto } from 'lib/entities'

// types
import type { ProductFormType } from '../types'

export function useEditProduct(): UseActionDialog<ProductDto, ProductFormType> {
  const { t } = useTranslation()

  const manager = useManager()

  const { openDialog: onClick, ...rest } = useFormDialog<
    ProductDto,
    UpdateProductDto,
    ProductDto,
    ProductFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: emptyProduct(),
    getFunction: id => manager.Products.getById(id),
    mutationFn: data => manager.Products.update(data),
    onSuccessMessage: t('_pages:common.actions.add.successMessage'),
    title: t('_pages:products.forms.edit'),
    ...ProductsQueryKeys.all(),
  })

  const { action } = useEditAction<ProductDto>({ onClick })

  return {
    action,
    openDialog: onClick,
    ...rest,
  }
}
