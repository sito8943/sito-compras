import { CommonModule } from '@angular/common'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    SimpleChanges,
} from '@angular/core'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
    FaIconComponent,
    FontAwesomeModule,
} from '@fortawesome/angular-fontawesome'

@Component({
    selector: 'app-action',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, FaIconComponent],
    templateUrl: './action.component.html',
    styleUrls: ['./action.component.css'],
})
export class ActionComponent implements OnChanges {
    @Input() id!: string
    @Input() icon?: IconDefinition | null
    @Input() tooltip?: string | null
    @Input() hidden?: boolean = false
    @Input() disabled?: boolean = false
    @Input() showText: boolean = false
    @Input() showTooltips: boolean = true

    ngOnChanges(changes: SimpleChanges) {
        if (changes['id']) {
            console.log(this)
        }
    }

    @Output() clicked = new EventEmitter<void>()

    handleClick() {
        if (!this.disabled) {
            this.clicked.emit()
        }
    }
}
