import type { BaseUpdateDto } from "./BaseUpdateDto"

export interface BaseDto extends BaseUpdateDto {
    createdAt?: string
    updatedAt?: string
    deleted?: boolean
}
