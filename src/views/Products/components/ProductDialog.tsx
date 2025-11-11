import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, useWatch } from 'react-hook-form'

// @sito/dashboard
import type { Option } from '@sito/dashboard'
import { TextInput, AutocompleteInput } from '@sito/dashboard'
import { FormDialog, ParagraphInput } from '@sito/dashboard-app'

// types
import type {
  AddProductDialogPropsType,
  ProductFormPropsType,
  EditProductDialogPropsType,
} from '../types'

// lib
import { Tables } from 'lib/api'

// hooks
import { useChecklistsCommon, useProductCategoriesCommon } from 'hooks'

export function ProductForm(props: ProductFormPropsType) {
  const {
    control,
    checklist,
    open,
    isLoading,
    setValue,
    lockCategory = false,
    lockChecklist = false,
  } = props
  const { t } = useTranslation()

  // #region external entities

  const checklists = useChecklistsCommon()

  const checklistOptions = useMemo(
    () => [...(checklists?.data ?? [])] as Option[],
    [checklists.data]
  )

  const categories = useProductCategoriesCommon()

  const categoryOptions = useMemo(
    () =>
      [
        ...(categories?.data?.map(category => ({
          ...category,
          name: category.name,
        })) ?? []),
      ] as Option[],
    [categories?.data, t]
  )

  // #endregion

  useEffect(() => {
    if (checklist && setValue) setValue('checklist', checklist)
  }, [open, checklist, setValue])

  const initial = useWatch({ control, name: 'initial' })

  useEffect(() => {
    if (initial && setValue)
      setValue('description', t('_entities:productCategory.description.init'))
  }, [open, initial, setValue, t])

  return (
    <>
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="id"
      />
      <Controller
        control={control}
        name="category"
        disabled={isLoading || lockCategory}
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            required
            options={categoryOptions}
            value={value}
            onChange={v => onChange(v)}
            label={t('_entities:product.category.label')}
            autoComplete={`${Tables.Products}-${t(
              '_entities:product.category.label'
            )}`}
            multiple={false}
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="checklist"
        disabled={isLoading || lockChecklist}
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            required
            options={checklistOptions}
            value={value}
            onChange={v => onChange(v)}
            label={t('_entities:product.checklist.label')}
            autoComplete={`${Tables.Products}-${t(
              '_entities:product.checklist.label'
            )}`}
            multiple={false}
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        rules={{
          required: `${t('_entities:product.amount.required')}`,
        }}
        name="amount"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            maxLength={20}
            value={value ?? ''}
            type="number"
            autoComplete={`${Tables.Products}-${t(
              '_entities:product.amount.label'
            )}`}
            label={t('_entities:product.amount.label')}
            placeholder={t('_entities:product.amount.placeholder')}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        rules={{
          required: `${t('_entities:product.date.required')}`,
        }}
        name="date"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            maxLength={20}
            value={value ?? ''}
            type="datetime-local"
            autoComplete={`${Tables.Products}-${t(
              '_entities:product.date.label'
            )}`}
            label={t('_entities:product.date.label')}
            placeholder={t('_entities:product.date.placeholder')}
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
            autoComplete={`${Tables.Products}-${t(
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

export function AddProductDialog(props: AddProductDialogPropsType) {
  return (
    <FormDialog {...props}>
      <ProductForm {...props} />
    </FormDialog>
  )
}

export function EditProductDialog(props: EditProductDialogPropsType) {
  return (
    <FormDialog {...props}>
      <ProductForm {...props} />
    </FormDialog>
  )
}

