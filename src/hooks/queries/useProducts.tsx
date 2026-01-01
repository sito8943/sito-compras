import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

// @sito/dashboard
import { useTableOptions } from '@sito/dashboard'

// providers
import { useLocalCache, useManager } from 'providers'
import { useAuth } from '@sito/dashboard-app'
import type { QueryParam, QueryResult } from '@sito/dashboard-app'

// types
import type { UseFetchPropsType } from './types.ts'

// lib
import type { ProductDto, CommonProductDto, FilterProductDto } from 'lib/entities'
import { Tables } from 'lib/api'

export const ProductsQueryKeys = {
  all: () => ({
    queryKey: ['products'],
  }),
  list: (query: QueryParam<ProductDto>, filters: FilterProductDto) => ({
    queryKey: [...ProductsQueryKeys.all().queryKey, 'list', query, filters],
  }),
  common: (filters: FilterProductDto) => ({
    queryKey: [...ProductsQueryKeys.all().queryKey, 'common', filters],
  }),
}

export function useProductsList(
  props: UseFetchPropsType<ProductDto, FilterProductDto>
): UseQueryResult<QueryResult<ProductDto>> {
  const {
    sortingBy,
    sortingOrder,
    currentPage,
    pageSize,
    filters: tableFilters,
  } = useTableOptions()

  const { filters = { deleted: false }, query } = props

  const manager = useManager()
  const { account } = useAuth()
  const { loadCache, updateCache } = useLocalCache()

  const parsedFilters = useMemo(
    () => ({
      ...tableFilters,
      ...filters,
      userId: account?.id,
    }),
    [account?.id, filters, tableFilters]
  )

  const parsedQueries = useMemo(
    () => ({
      sortingBy: sortingBy as keyof ProductDto,
      sortingOrder,
      currentPage,
      pageSize,
      ...query,
    }),
    [currentPage, pageSize, query, sortingBy, sortingOrder]
  )

  return useQuery({
    ...ProductsQueryKeys.list(parsedQueries, {
      ...parsedFilters,
    }),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Products.get(parsedQueries, parsedFilters)

        updateCache(
          `${Tables.Products}_${filters?.checklistId ?? 0}`,
          result.items
        )
        return result
      } catch (error) {
        console.warn('API failed, loading products from cache', error)

        const cached = loadCache(
          `${Tables.Products}_${filters?.checklistId ?? 0}`
        )
        if (!cached || !Array.isArray(cached))
          throw new Error('No cached products available')
        return {
          items: cached as unknown as ProductDto,
          total: cached?.length,
        } as unknown as QueryResult<ProductDto>
      }
    },
  })
}

export function useProductsCommon(): UseQueryResult<CommonProductDto[]> {
  const manager = useManager()
  const { account } = useAuth()
  const { loadCache, updateCache, inCache } = useLocalCache()

  return useQuery({
    ...ProductsQueryKeys.common({ deleted: false }),
    queryFn: async () => {
      try {
        const result = await manager.Products.commonGet({
          deleted: false,
          userId: account?.id,
        })
        if (!inCache(Tables.Products)) updateCache(Tables.Products, result)
        return result
      } catch (error) {
        console.warn('API failed, loading products from cache', error)
        const cached = loadCache(Tables.Products) as CommonProductDto[]
        if (!cached || !Array.isArray(cached))
          throw new Error('No cached products available')
        return cached.map(({ id, updatedAt, name, price, count }) => ({
          id,
          updatedAt,
          name,
          price,
          count,
        }))
      }
    },
  })
}
