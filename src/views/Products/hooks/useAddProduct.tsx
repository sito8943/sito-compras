import { useTranslation } from 'react-i18next'

// @sito/dashboard-app
import { useNotification, useFormDialog } from '@sito/dashboard-app'

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

  const { showErrorNotification } = useNotification()

  const { handleSubmit, setError, ...rest } = useFormDialog<
    ProductDto,
    AddProductDto,
    ProductDto,
    ProductFormType
  >({
    formToDto: formToAddDto,
    dtoToForm,
    defaultValues: emptyProduct(),
    mutationFn: data => manager.Products.insert(data),
    onSuccessMessage: t('_pages:common.actions.add.successMessage'),
    title: t('_pages:products.forms.add'),
    onError: error => {
      if (error.message === 'balance.greaterThan0') {
        setError?.(
          'amount',
          { message: t('_entities:checklist.balance.greaterThan0') },
          {
            shouldFocus: true,
          }
        )
        showErrorNotification({
          message: t('_entities:checklist.balance.greaterThan0'),
        })
      }
    },
    ...ProductsQueryKeys.all(),
  })

  return {
    handleSubmit,
    ...rest,
  }
}
