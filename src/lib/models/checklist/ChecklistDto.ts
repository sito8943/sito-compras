import type { BaseDto } from '../base'
import type { ProductDto } from '../product'

export interface ChecklistDto extends BaseDto {
    title: string
    completed: boolean
    items: ProductDto[]
}
