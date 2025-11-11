import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, useWatch } from 'react-hook-form'

// @sito/dashboard
import { TextInput } from '@sito/dashboard'
import { useAuth, FormDialog, ParagraphInput } from '@sito/dashboard-app'

// icons

// types
import type {
  AddProductCategoryDialogPropsType,
  ProductCategoryFormPropsType,
  EditProductCategoryDialogPropsType,
} from '../types'

// lib
import { Tables } from 'lib/api'

// utils

export function ProductCategoryForm(props: ProductCategoryFormPropsType) {
  const { control, isLoading, setValue, open } = props
  const { t } = useTranslation()
  const { account } = useAuth()

  useEffect(() => {
    if (account && setValue) setValue('userId', account?.id ?? 0)
  }, [account, setValue, open])

  const initial = useWatch({ control, name: 'initial' })

  useEffect(() => {
    if (initial && setValue) {
      setValue('name', t('_entities:productCategory.name.init'))
      setValue('description', t('_entities:productCategory.description.init'))
    }
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
            autoComplete={`${Tables.ProductCategories}-${t(
              '_entities:base.name.label'
            )}`}
            label={t('_entities:base.name.label')}
            placeholder={t('_entities:productCategory.name.placeholder')}
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
            autoComplete={`${Tables.ProductCategories}-${t(
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

export function AddProductCategoryDialog(
  props: AddProductCategoryDialogPropsType
) {
  return (
    <FormDialog {...props}>
      <ProductCategoryForm {...props} />
    </FormDialog>
  )
}

export function EditProductCategoryDialog(
  props: EditProductCategoryDialogPropsType
) {
  return (
    <FormDialog {...props}>
      <ProductCategoryForm {...props} />
    </FormDialog>
  )
}

