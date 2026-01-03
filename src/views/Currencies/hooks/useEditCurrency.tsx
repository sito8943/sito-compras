import { useTranslation } from 'react-i18next'

// @sito/dashboard-app
import { useAuth, useFormDialog } from '@sito/dashboard-app'

// providers
import { useManager } from 'providers'

// hooks
import { CurrenciesQueryKeys } from 'hooks'

// utils
import { dtoToForm, emptyCurrency, formToDto } from '../utils'

// lib
import type { UpdateCurrencyDto, CurrencyDto } from 'lib/entities'

// types
import type { CurrencyFormType } from '../types'

export function useEditCurrency() {
  const { t } = useTranslation()

  const manager = useManager()
  const { account } = useAuth()

  return useFormDialog<
    CurrencyDto,
    UpdateCurrencyDto,
    CurrencyDto,
    CurrencyFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: emptyCurrency(account?.id ?? 0),
    getFunction: id => manager.Currencies.getById(id),
    mutationFn: data => manager.Currencies.update(data),
    onSuccessMessage: t('_pages:common.actions.add.successMessage'),
    title: t('_pages:currencies.forms.edit'),
    ...CurrenciesQueryKeys.all(),
  })
}

