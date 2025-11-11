// @sito/dashboard
import type { DeleteDto } from '@sito/dashboard-app'

// types
import type { AddProductDto } from './AddProductDto'

export interface UpdateProductDto extends DeleteDto, AddProductDto {}

