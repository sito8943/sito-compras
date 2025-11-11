import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, useWatch } from 'react-hook-form'

// @sito/dashboard
import { TextInput, type Option, AutocompleteInput } from '@sito/dashboard'
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
import { useCurrenciesCommon } from 'hooks'

export function ChecklistForm(props: ChecklistFormPropsType) {
  const { control, isLoading, setValue, open } = props
  const { t } = useTranslation()
  const { account } = useAuth()

  useEffect(() => {
    if (account && setValue) setValue('userId', account?.id ?? 0)
  }, [account, setValue, open])

  const currencies = useCurrenciesCommon()

  const currencyOptions = useMemo(
    () => [...(currencies?.data ?? [])] as Option[],
    [currencies.data]
  )

  const { id } = useWatch({ control })

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
            placeholder={t('_entities:account.name.placeholder')}
            {...rest}
          />
        )}
      />
      {!id && (
        <Controller
          control={control}
          rules={{
            required: `${t('_entities:account.balance.required')}`,
          }}
          name="balance"
          disabled={isLoading}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              required
              maxLength={20}
              value={value ?? ''}
              type="number"
              autoComplete={`${Tables.Checklists}-${t(
                '_entities:account.balance.initial'
              )}`}
              label={t('_entities:account.balance.initial')}
              placeholder={t('_entities:account.balance.placeholder')}
              {...rest}
            />
          )}
        />
      )}
      <Controller
        control={control}
        name="currency"
        disabled={isLoading}
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            required
            options={currencyOptions}
            value={value}
            autoComplete={`${Tables.Checklists}-${t(
              '_entities:account.currency.label'
            )}`}
            onChange={v => onChange(v)}
            label={t('_entities:account.currency.label')}
            multiple={false}
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

