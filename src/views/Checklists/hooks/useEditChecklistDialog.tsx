import { useTranslation } from 'react-i18next'

// @sito/dashboard-app
import { useFormDialog } from '@sito/dashboard-app'

// providers
import { useManager } from 'providers'

// hooks
import { ChecklistsQueryKeys } from 'hooks'

// utils
import { dtoToForm, emptyChecklist, formToUpdateDto } from '../utils'

// types
import type { ChecklistFormType } from '../types'

// lib
import type { UpdateChecklistDto, ChecklistDto } from 'lib/models'

export function useEditChecklistDialog() {
  const { t } = useTranslation()

  const manager = useManager()

  return useFormDialog<
    ChecklistDto,
    UpdateChecklistDto,
    ChecklistDto,
    ChecklistFormType
  >({
    formToDto: formToUpdateDto,
    dtoToForm,
    defaultValues: emptyChecklist,
    getFunction: id => manager.Checklists.getById(id),
    mutationFn: data => manager.Checklists.update(data),
    onSuccessMessage: t('_pages:common.actions.add.successMessage'),
    title: t('_pages:checklists.forms.edit'),
    ...ChecklistsQueryKeys.all(),
  })
}

