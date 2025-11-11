import type { FieldValues } from 'react-hook-form'

// @sito/dashboard
import type { Action } from '@sito/dashboard'
import type { ValidationError, FormDialogPropsType } from '@sito/dashboard-app'

// lib
import type { CurrencyDto } from 'lib/models'

export interface CurrencyCardPropsType extends CurrencyDto {
  actions: Action<CurrencyDto>[]
  onClick: (id: number) => void
  deleted: boolean
}

export interface CurrencyFormType
  extends Omit<CurrencyDto, 'deleted' | 'createdAt' | 'updatedAt' | 'user'>,
    FieldValues {
  userId: number
}

export type CurrencyFormPropsType = FormDialogPropsType<
  CurrencyFormType,
  ValidationError
>

export type AddCurrencyDialogPropsType = FormDialogPropsType<
  CurrencyFormType,
  ValidationError
>

export type EditCurrencyDialogPropsType = FormDialogPropsType<
  CurrencyFormType,
  ValidationError
>

