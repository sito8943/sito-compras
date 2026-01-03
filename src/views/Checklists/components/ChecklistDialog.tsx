import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller } from 'react-hook-form'

// @sito/dashboard
import { TextInput } from '@sito/dashboard'
import { useAuth, FormDialog, ParagraphInput } from '@sito/dashboard-app'

// types
import type {
  AddChecklistDialogPropsType,
  ChecklistFormPropsType,
  EditChecklistDialogPropsType,
} from '../types'

// lib
import { Tables } from 'lib/api'

// hooks

export function ChecklistForm(props: ChecklistFormPropsType) {
  const { control, isLoading, setValue, open } = props
  const { t } = useTranslation()
  const { account } = useAuth()

  useEffect(() => {
    if (account && setValue) setValue('userId', account?.id ?? 0)
  }, [account, setValue, open])

  return (
    <>
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="id"
      />
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="userId"
      />
      <Controller
        control={control}
        rules={{
          required: `${t('_entities:base.name.required')}`,
        }}
        name="name"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            maxLength={20}
            value={value ?? ''}
            autoComplete={`${Tables.Checklists}-${t(
              '_entities:base.name.label'
            )}`}
            label={t('_entities:base.name.label')}
            placeholder={t('_entities:checklist.name.placeholder')}
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <ParagraphInput
            maxLength={60}
            value={value ?? ''}
            autoComplete={`${Tables.Checklists}-${t(
              '_entities:base.description.label'
            )}`}
            label={t('_entities:base.description.label')}
            placeholder={t('_entities:base.description.placeholder')}
            {...rest}
          />
        )}
      />
    </>
  )
}

export function AddChecklistDialog(props: AddChecklistDialogPropsType) {
  return (
    <FormDialog {...props}>
      <ChecklistForm {...props} />
    </FormDialog>
  )
}

export function EditChecklistDialog(props: EditChecklistDialogPropsType) {
  return (
    <FormDialog {...props}>
      <ChecklistForm {...props} />
    </FormDialog>
  )
}

