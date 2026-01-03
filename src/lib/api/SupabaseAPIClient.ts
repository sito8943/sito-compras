import type { SupabaseClient } from "@supabase/supabase-js"

// types from external lib
import {
  BaseEntityDto,
  BaseFilterDto,
  fromLocal,
  Methods,
  type QueryParam,
  type QueryResult,
} from "@sito/dashboard-app"

// shared supabase singleton
import { supabase } from "./supabaseClient"
import { getRelationSelect, getCommonSelect } from "./relationSelectConfig"

type Order = "asc" | "desc"

export class SupabaseAPIClient {
  baseUrl: string
  userKey: string
  secured: boolean
  supabase: SupabaseClient

  constructor(baseUrl: string, userKey = "user", secured = true) {
    this.baseUrl = baseUrl
    this.userKey = userKey
    this.secured = secured
    this.supabase = supabase
  }

  // Kept for compatibility, not used in Supabase
  defaultTokenAcquirer(): HeadersInit | undefined {
    const token = fromLocal(this.userKey) as string
    if (token && token.length)
      return { Authorization: `Bearer ${token}` } as HeadersInit
    return undefined
  }

  private applyFilters<TFilter extends BaseFilterDto>(
    table: string,
    query: ReturnType<SupabaseClient["from"]>,
    filters?: TFilter
  ) {
    let q = query
    if (!filters) return q

    const anyFilters = filters as unknown as Record<string, unknown>

    // Common filters
    if (anyFilters.userId !== undefined) q = q.eq("userId", anyFilters.userId as any)
    if (anyFilters.deleted !== undefined) q = q.eq("deleted", anyFilters.deleted as boolean)

    // Generic equals for known scalar fields
    for (const key of ["name", "price", "checklistId", "description", "completed", "symbol"]) {
      const val = anyFilters[key]
      if (val !== undefined && typeof val !== "object") q = q.eq(key, val as any)
    }

    // Arrays
    for (const key of Object.keys(anyFilters)) {
      const val = (anyFilters as any)[key]
      if (Array.isArray(val)) q = q.in(key, val)
    }

    return q
  }

  private applyQuery<TDto extends BaseEntityDto>(
    q: ReturnType<SupabaseClient["from"]>,
    query?: QueryParam<TDto>
  ) {
    let curr = q
    const sortingBy = (query?.sortingBy as string) || "updatedAt"
    const sortingOrder = (query?.sortingOrder as Order) || "desc"
    curr = curr.order(sortingBy, { ascending: sortingOrder === "asc" })

    if (query?.currentPage !== undefined && query?.pageSize !== undefined) {
      const from = (query.currentPage - 1) * query.pageSize
      const to = from + query.pageSize - 1
      curr = curr.range(from, to)
    }

    return curr
  }

  // Generic SELECT with pagination and filters
  async get<TDto extends BaseEntityDto, TFilter extends BaseFilterDto>(
    endpoint: string,
    query?: QueryParam<TDto>,
    filters?: TFilter
  ) {
    const table = endpoint.replace(/^\//, "")
    const select = getRelationSelect(table) ?? "*"
    let q = this.supabase.from(table).select(select, { count: "exact" })
    q = this.applyFilters(table, q, filters)
    q = this.applyQuery(q, query)
    const { data, error, count } = await q
    if (error) throw new Error(error.message)
    // Flatten many-to-many joins for expected DTO shapes
    let items = (data ?? []) as any[]
    if (table === 'products') {
      items = items.map((it) => ({
        ...it,
        categories: Array.isArray(it?.categories)
          ? (it.categories as any[])
              .map((c) => c?.category)
              .filter(Boolean)
          : null,
      }))
    }
    if (table === 'product-categories') {
      items = items.map((it) => ({
        ...it,
        products: Array.isArray(it?.products)
          ? (it.products as any[])
              .map((p) => p?.product)
              .filter(Boolean)
          : null,
      }))
    }

    return { items: items as TDto[], total: count ?? (items?.length ?? 0) } as QueryResult<TDto>
  }

  async doQuery<TResponse, TBody = unknown>(
    endpoint: string,
    _method?: Methods,
    _body?: TBody,
    _header?: HeadersInit
  ) {
    const clean = endpoint.replace(this.baseUrl, "").replace(/^\//, "")
    const url = new URL(`http://local/${clean}`)
    const path = url.pathname.replace(/^\//, "")

    // /:table/:id
    const idMatch = path.match(/^(.*)\/(\d+)$/)
    if (idMatch) {
      const table = idMatch[1]
      const id = Number(idMatch[2])
      const select = getRelationSelect(table) ?? "*"
      const { data, error } = await this.supabase
        .from(table)
        .select(select)
        .eq("id", id)
        .single()
      if (error) throw new Error(error.message)
      return data as TResponse
    }

    // /:table/common
    if (/\/common$/.test(path)) {
      const table = path.replace(/\/common$/, "")
      const select = getCommonSelect(table) ?? "id, updatedAt"
      let q = this.supabase.from(table).select(select)

      // Apply filters from query string (userId, deleted, etc.)
      const deletedParam = url.searchParams.get("deleted")
      const userIdParam = url.searchParams.get("userId")
      const maybeFilters: Record<string, unknown> = {}
      if (deletedParam !== null)
        maybeFilters.deleted = deletedParam === "true" || deletedParam === "1"
      if (userIdParam !== null) maybeFilters.userId = userIdParam
      q = this.applyFilters(table, q, maybeFilters as any)
      q = q.order("updatedAt", { ascending: false })
      const { data, error } = await q
      if (error) throw new Error(error.message)
      return (data ?? []) as TResponse
    }

    // /:table/export
    if (/\/export$/.test(path)) {
      const table = path.replace(/\/export$/, "")
      const select = getRelationSelect(table) ?? "*"
      const { data, error } = await this.supabase.from(table).select(select)
      if (error) throw new Error(error.message)
      return (data ?? []) as TResponse
    }

    throw new Error(`Unsupported endpoint for supabase adapter: ${clean}`)
  }

  async patch<TDto, TUpdateDto>(endpoint: string, data: TUpdateDto): Promise<TDto> {
    const clean = endpoint.replace(/^\//, "")

    // restore: /:table/restore with ids[]
    if (/\/restore$/.test(clean)) {
      const table = clean.replace(/\/restore$/, "")
      const ids = (data as unknown as number[]) ?? []
      const { error } = await this.supabase.from(table).update({ deleted: false }).in("id", ids)
      if (error) throw new Error(error.message)
      return (ids?.length ?? 0) as unknown as TDto
    }

    // generic: /:table/:id
    const idMatch = clean.match(/^(.*)\/(\d+)$/)
    if (idMatch) {
      const table = idMatch[1]
      const id = Number(idMatch[2])
      const { data: result, error } = await this.supabase
        .from(table)
        .update(data as Record<string, unknown>)
        .eq("id", id)
        .select("*")
        .single()
      if (error) throw new Error(error.message)
      return result as TDto
    }

    throw new Error(`Unsupported patch endpoint: ${clean}`)
  }

  async post<TDto, TAddDto>(endpoint: string, data: TAddDto): Promise<TDto> {
    const table = endpoint.replace(/^\//, "")
    const { data: result, error } = await this.supabase
      .from(table)
      .insert(data as unknown as Record<string, unknown>)
      .select("*")
      .single()
    if (error) throw new Error(error.message)
    return result as TDto
  }

  async delete(endpoint: string, data: number[]) {
    const table = endpoint.replace(/^\//, "")
    const ids = data ?? []
    const { error } = await this.supabase.from(table).update({ deleted: true }).in("id", ids)
    if (error) throw new Error(error.message)
    return ids.length
  }
}
