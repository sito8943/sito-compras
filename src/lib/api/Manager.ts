import ChecklistClient from './ChecklistClient'
import CurrencyClient from './CurrencyClient'
import ProductClient from './ProductClient'
import ProductCategoryClient from './ProductCategoryClient'

// @sito/dashboard-app
import { IManager } from '@sito/dashboard-app'
import { SupabaseAuth } from './SupabaseAuth'

// config
import { config } from '../../config'

export class Manager extends IManager {
  checklists: ChecklistClient = new ChecklistClient()
  currencies: CurrencyClient = new CurrencyClient()
  products: ProductClient = new ProductClient()
  productCategories: ProductCategoryClient = new ProductCategoryClient()

  constructor() {
    super(config.apiUrl, config.auth.user)
    // Use Supabase authentication under the hood while keeping IManager API
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.auth = new SupabaseAuth()
  }

  get ProductCategories(): ProductCategoryClient {
    return this.productCategories
  }

  /**
   * @returns product
   */
  get Products(): ProductClient {
    return this.products
  }

  /**
   * @returns checklists
   */
  get Checklists(): ChecklistClient {
    return this.checklists
  }

  /**
   * @returns currencies
   */
  get Currencies(): CurrencyClient {
    return this.currencies
  }
}
