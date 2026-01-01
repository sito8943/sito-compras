import type { FieldValues } from 'react-hook-form'

// @sito/dashboard
import type { Action } from '@sito/dashboard'
import type { ValidationError, FormDialogPropsType } from '@sito/dashboard-app'

// lib
import type { ChecklistDto } from 'lib/entities'

export * from './actions'

export interface ChecklistCardPropsType extends ChecklistDto {
  actions: Action<ChecklistDto>[]
  onClick: (id: number) => void
  deleted: boolean
}

export interface ChecklistFormType
  extends Omit<
      ChecklistDto,
      'deleted' | 'createdAt' | 'updatedAt' | 'user' | 'products' | 'completed'
    >,
    FieldValues {
  userId: number
}

export type ChecklistFormPropsType = FormDialogPropsType<
  ChecklistFormType,
  ValidationError
>

export type AddChecklistDialogPropsType = FormDialogPropsType<
  ChecklistFormType,
  ValidationError
>

export type EditChecklistDialogPropsType = FormDialogPropsType<
  ChecklistFormType,
  ValidationError
>
