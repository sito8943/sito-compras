import { BaseDto } from './BaseDto'

export interface Product extends BaseDto {
    name: string
    price: number
    count: number
    description: string
}
