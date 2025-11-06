import type { BaseEntityDto } from '@sito/dashboard-app'
import type { AddProductDto } from './AddProductDto'

export interface ProductDto extends BaseEntityDto, AddProductDto {}

