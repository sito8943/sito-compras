import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

// models
import { BaseDto } from '../../../core/models/BaseDto'

// types
import { ActionPropsType } from '../../../core/types/Action'

// components
import { ActionComponent } from '../action/action.component'

@Component({
    selector: 'app-actions',
    standalone: true,
    imports: [CommonModule, ActionComponent, FontAwesomeModule],
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.css'],
})
export class ActionsComponent<TRow extends BaseDto> {
    @Input() actions: ActionPropsType<TRow>[] = []
    @Input() className = ''
    @Input() showTooltips = true
    @Input() showActionTexts = false
}
