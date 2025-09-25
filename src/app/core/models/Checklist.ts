import { Product } from './Product'

export type CheckList = {
    id: number
    title: string
    completed: boolean
    items: Product[]
}
