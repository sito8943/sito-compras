import type { ReactNode } from 'react'

// @sito/dashboard
import type { Action } from '@sito/dashboard'
import type { BaseEntityDto } from '@sito/dashboard-app'

export type ItemCardPropsType<TEntity extends BaseEntityDto> = {
  children: ReactNode
  containerClassName?: string
  actions: Action<TEntity>[]
  title: string | ReactNode
  className?: string
  name: string
  onClick?: () => void
  deleted: boolean
}

export type ItemCardTitlePropsType = {
  children: ReactNode
  deleted?: boolean
}

