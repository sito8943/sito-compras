import type { BaseDto } from '../base'
import type { AddProductDto } from './AddProductDto'

export interface ProductDto extends BaseDto, AddProductDto {}

