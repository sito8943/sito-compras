import { BaseDto } from './BaseDto'
import { Product } from './Product'

export interface CheckList extends BaseDto {
    title: string
    completed: boolean
    items: Product[]
}
