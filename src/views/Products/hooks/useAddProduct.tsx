import { useTranslation } from 'react-i18next'

// @sito/dashboard-app
import { useFormDialog, useAuth } from '@sito/dashboard-app'

// providers
import { useManager } from 'providers'

// hooks
import { ProductsQueryKeys } from 'hooks'

// utils
import { dtoToForm, emptyProduct, formToAddDto } from '../utils'

// types
import type {
  AddProductDialogPropsType,
  ProductFormType,
  UseAddProductDialogActionPropsType,
} from '../types'

// lib
import type { AddProductDto, ProductDto } from 'lib/entities'

export function useAddProduct(
  props: UseAddProductDialogActionPropsType
): AddProductDialogPropsType {
  const {} = props

  const { t } = useTranslation()

  const manager = useManager()
  const { account } = useAuth()

  const { handleSubmit, setError, ...rest } = useFormDialog<
    ProductDto,
    AddProductDto,
    ProductDto,
    ProductFormType
  >({
    formToDto: formToAddDto,
    dtoToForm,
    defaultValues: emptyProduct(account?.id ?? 0),
    mutationFn: data => manager.Products.insert(data),
    onSuccessMessage: t('_pages:common.actions.add.successMessage'),
    title: t('_pages:products.forms.add'),
    ...ProductsQueryKeys.all(),
  })

  return {
    handleSubmit,
    ...rest,
  }
}

