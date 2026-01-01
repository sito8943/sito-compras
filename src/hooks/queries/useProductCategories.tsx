import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

// providers
import { useLocalCache, useManager } from 'providers'
import { useAuth } from '@sito/dashboard-app'
import type { QueryResult } from '@sito/dashboard-app'

// types
import type { UseFetchPropsType } from './types.ts'

// lib
import type {
  ProductCategoryDto,
  CommonProductCategoryDto,
  FilterProductCategoryDto,
} from 'lib/entities'
import { Tables } from 'lib/api'

export const ProductCategoriesQueryKeys = {
  all: () => ({
    queryKey: ['product-categories'],
  }),
  list: (filters: FilterProductCategoryDto) => ({
    queryKey: [...ProductCategoriesQueryKeys.all().queryKey, 'list', filters],
  }),
  common: () => ({
    queryKey: [...ProductCategoriesQueryKeys.all().queryKey, 'common'],
  }),
}

export function useProductCategoriesList(
  props: UseFetchPropsType<ProductCategoryDto, FilterProductCategoryDto>
): UseQueryResult<QueryResult<ProductCategoryDto>> {
  const { filters = { deleted: false } } = props

  const manager = useManager()
  const { account } = useAuth()
  const { loadCache, updateCache, inCache } = useLocalCache()

  return useQuery({
    ...ProductCategoriesQueryKeys.list(filters),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.ProductCategories.get(undefined, {
          ...filters,
          userId: account?.id,
        })
        if (!inCache(Tables.ProductCategories))
          updateCache(Tables.ProductCategories, result.items)
        return result
      } catch (error) {
        console.warn('API failed, loading categories from cache', error)
        const cached = loadCache(Tables.ProductCategories)
        if (!cached || !Array.isArray(cached))
          throw new Error('No cached categories available')
        return {
          items: cached as unknown as ProductCategoryDto,
          total: cached?.length,
        } as unknown as QueryResult<ProductCategoryDto>
      }
    },
  })
}

export function useProductCategoriesCommon(): UseQueryResult<
  CommonProductCategoryDto[]
> {
  const manager = useManager()
  const { account } = useAuth()
  const { loadCache, updateCache } = useLocalCache()

  return useQuery({
    ...ProductCategoriesQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.ProductCategories.commonGet({
          deleted: false,
          userId: account?.id,
        })
        updateCache(Tables.ProductCategories, result)
        return result
      } catch (error) {
        console.warn('API failed, loading product categories from cache', error)
        const cached = loadCache(
          Tables.ProductCategories
        ) as CommonProductCategoryDto[]
        if (!cached || !Array.isArray(cached))
          throw new Error('No cached product categories available')
        return cached.map(
          ({ id, name, updatedAt }: CommonProductCategoryDto) => ({
            id,
            name,
            updatedAt,
          })
        )
      }
    },
  })
}
