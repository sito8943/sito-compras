import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

// models
import { BaseDto } from '../models/BaseDto'

export type Action<TRow extends BaseDto> = {
    id: string
    clicked: (entity?: TRow) => void
    icon: IconDefinition
    tooltip: string
    disabled?: boolean
    hidden?: boolean
}

export interface ActionPropsType<TRow extends BaseDto> extends Action<TRow> {
    showText?: boolean
    showTooltips?: boolean
}
