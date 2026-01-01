/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from 'react'

// @sito/dashboard
import { fromLocal, toLocal } from '@sito/dashboard-app'
import type { BaseEntityDto } from '@sito/dashboard-app'

// config
import { config } from '../config.ts'

// types
import type {
  BasicProviderPropTypes,
  LocalCacheProviderContextType,
  FileDataType,
} from './types.ts'

// lib
import type {
  ChecklistDto,
  CurrencyDto,
  ProductCategoryDto,
  ProductDto,
} from 'lib/entities'
import { Tables } from 'lib/api/types.ts'

const LocalCacheContext = createContext({} as LocalCacheProviderContextType)

const LocalCacheProvider = (props: BasicProviderPropTypes) => {
  const { children } = props

  const [data, setData] = useState<FileDataType>({
    [Tables.Checklists]: [] as ChecklistDto[],
    [Tables.Currencies]: [] as CurrencyDto[],
    [Tables.ProductCategories]: [] as ProductCategoryDto[],
    [Tables.Products]: [] as ProductDto[],
  })

  const inCache = useCallback(
    (key: string) => {
      return data[key]
    },
    [data]
  )

  const updateCache = useCallback(
    <T = BaseEntityDto,>(key: string, value: T[]) => {
      const newData = {
        ...data,
      [key]: value,
      }
      setData(
        prevData =>
          ({
            ...prevData,
            [key]: value,
          } as FileDataType)
      )
      toLocal(config.localCache, newData)
    },
    [data]
  )

  const loadCache = useCallback(
    <T = BaseEntityDto,>(key: string): T[] | null => {
      const content = fromLocal(config.localCache, 'object')
      return content ? content[key] : null
    },
    []
  )

  return (
    <LocalCacheContext.Provider value={{ updateCache, loadCache, inCache }}>
      {children}
    </LocalCacheContext.Provider>
  )
}

const useLocalCache = () => {
  const context = useContext(LocalCacheContext)

  if (context === undefined)
    throw new Error('configContext must be used within a Provider')
  return context
}

export { LocalCacheProvider, useLocalCache }
