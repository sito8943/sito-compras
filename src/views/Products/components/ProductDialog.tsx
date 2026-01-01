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
import { useProductCategoriesCommon } from 'hooks'

export function ProductForm(props: ProductFormPropsType) {
  const { control, open, isLoading, setValue, lockCategories = false } = props
  const { t } = useTranslation()

  // #region external entities

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
        disabled={isLoading || lockCategories}
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            options={categoryOptions}
            value={value}
            onChange={v => onChange(v)}
            label={t('_entities:product.categories.label')}
            autoComplete={`${Tables.Products}-${t(
              '_entities:product.categories.label'
            )}`}
            multiple={true}
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

