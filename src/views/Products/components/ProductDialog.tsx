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
import { useCurrenciesCommon, useProductCategoriesCommon } from 'hooks'

export function ProductForm(props: ProductFormPropsType) {
  const { control, open, isLoading, setValue } = props
  const { t } = useTranslation()

  // #region external entities

  const currencies = useCurrenciesCommon()

  const currencyOptions = useMemo(
    () => [...(currencies?.data ?? [])] as Option[],
    [currencies.data]
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
            placeholder={t('_entities:product.name.placeholder')}
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="category"
        disabled={isLoading}
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

      <div className="flex gap-2 items-center">
        <Controller
          control={control}
          rules={{
            required: `${t('_entities:product.price.required')}`,
          }}
          name="price"
          disabled={isLoading}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              required
              maxLength={20}
              value={value ?? ''}
              type="number"
              autoComplete={`${Tables.Products}-${t(
                '_entities:product.price.label'
              )}`}
              label={t('_entities:product.price.label')}
              placeholder={t('_entities:product.price.placeholder')}
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="currency"
          disabled={isLoading}
          render={({ field: { value, onChange, ...rest } }) => (
            <AutocompleteInput
              required
              options={currencyOptions}
              value={value}
              autoComplete={`${Tables.Products}-${t(
                '_entities:product.currency.label'
              )}`}
              onChange={v => onChange(v)}
              label={t('_entities:product.currency.label')}
              multiple={false}
              {...rest}
            />
          )}
        />
      </div>
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

