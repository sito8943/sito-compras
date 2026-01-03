import { useTranslation } from 'react-i18next'

// @sito/dashboard-app
import { useFormDialog, useAuth } from '@sito/dashboard-app'

// providers
import { useManager } from 'providers'

// hooks
import { ChecklistsQueryKeys } from 'hooks'

// utils
import { dtoToForm, emptyChecklist, formToAddDto } from '../utils'

// types
import type { ChecklistFormType } from '../types'

// lib
import type { AddChecklistDto, ChecklistDto } from 'lib/entities'

export function useAddChecklistDialog() {
  const { t } = useTranslation()

  const manager = useManager()
  const { account } = useAuth()

  const { handleSubmit, ...rest } = useFormDialog<
    ChecklistDto,
    AddChecklistDto,
    ChecklistDto,
    ChecklistFormType
  >({
    formToDto: formToAddDto,
    dtoToForm,
    defaultValues: emptyChecklist(account?.id ?? 0),
    mutationFn: data => manager.Checklists.insert(data),
    onSuccessMessage: t('_pages:common.actions.add.successMessage'),
    title: t('_pages:checklists.forms.add'),
    ...ChecklistsQueryKeys.all(),
  })

  return {
    handleSubmit,
    ...rest,
  }
}
