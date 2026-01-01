export type RelationSelectConfig = Record<string, string>

// Central place to declare related selects per table
export const relationSelectConfig: RelationSelectConfig = {
  products:
    "*, " +
    "currency:currencyId(id, name, symbol), " +
    // many-to-many via products-categories-rel -> expose as categories
    "categories:products-categories-rel(category:product-categories(id, name, updatedAt))",
  checklists: "*",
  currencies: "*",
  // expose related products for each category through the relation table
  "product-categories":
    "*, products:products-categories-rel(product:products(id, name, price, count, updatedAt))",
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
