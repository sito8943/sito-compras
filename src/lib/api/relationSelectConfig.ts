export type RelationSelectConfig = Record<string, string>

// Central place to declare related selects per table
export const relationSelectConfig: RelationSelectConfig = {
  products:
    "*, " +
    "category:product-categories(id, name, updatedAt), " +
    "checklist:checklists(id, name, updatedAt)",
  checklists: "*",
  currencies: "*",
  "product-categories": "*",
}

export const getRelationSelect = (table: string): string | undefined =>
  relationSelectConfig[table]

// Common selects for /:table/common endpoints
export const commonSelectConfig: RelationSelectConfig = {
  products: "id, updatedAt, name, price, count",
  checklists: "id, updatedAt, name",
  currencies: "id, updatedAt, name, symbol",
  "product-categories": "id, updatedAt, name",
}

export const getCommonSelect = (table: string): string | undefined =>
  commonSelectConfig[table]

