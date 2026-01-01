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
  ChecklistDto,
  CommonChecklistDto,
  FilterChecklistDto,
} from 'lib/entities'
import { Tables } from 'lib/api'

export const ChecklistsQueryKeys = {
  all: () => ({
    queryKey: ['checklists'],
  }),
  list: (filters: FilterChecklistDto) => ({
    queryKey: [...ChecklistsQueryKeys.all().queryKey, 'list', filters],
  }),
  common: () => ({
    queryKey: [...ChecklistsQueryKeys.all().queryKey, 'common'],
  }),
}

export function useChecklistsList(
  props: UseFetchPropsType<ChecklistDto, FilterChecklistDto>
): UseQueryResult<QueryResult<ChecklistDto>> {
  const { filters = { deleted: false } } = props

  const manager = useManager()
  const { account } = useAuth()
  const { loadCache, updateCache } = useLocalCache()

  return useQuery({
    ...ChecklistsQueryKeys.list(filters),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Checklists.get(undefined, {
          ...filters,
          userId: account?.id,
        })

        updateCache(Tables.Checklists, result.items)
        return result
      } catch (error) {
        console.warn('API failed, loading checklists from cache', error)
        const cached = loadCache(Tables.Checklists)
        if (!cached || !Array.isArray(cached))
          throw new Error('No cached checklists available')
        return {
          items: cached as unknown as ChecklistDto,
          total: cached?.length,
        } as unknown as QueryResult<ChecklistDto>
      }
    },
  })
}

export function useChecklistsCommon(): UseQueryResult<CommonChecklistDto[]> {
  const manager = useManager()
  const { account } = useAuth()
  const { loadCache, updateCache, inCache } = useLocalCache()

  return useQuery({
    ...ChecklistsQueryKeys.common(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Checklists.commonGet({
          deleted: false,
          userId: account?.id,
        })
        if (!inCache(Tables.Checklists)) updateCache(Tables.Checklists, result)
        return result
      } catch (error) {
        console.warn('API failed, loading checklists from cache', error)
        const cached = loadCache(Tables.Checklists) as CommonChecklistDto[]
        if (!cached || !Array.isArray(cached))
          throw new Error('No cached checklists available')
        return cached.map(({ id, name, updatedAt, currency }) => ({
          id,
          name,
          updatedAt,
          currency,
        }))
      }
    },
  })
}
