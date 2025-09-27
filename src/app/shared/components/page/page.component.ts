import {
    Component,
    HostListener,
    signal,
    Input,
    Output,
    EventEmitter,
    SimpleChanges,
    OnChanges,
} from '@angular/core'
import { CommonModule, Location } from '@angular/common'

// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import {
    faArrowLeft,
    faAdd,
    faRotateLeft,
    faFilter,
} from '@fortawesome/free-solid-svg-icons'

// models
import { BaseDto } from '../../../core/models/BaseDto'

// types
import { Action } from '../../../core/types/Action'

// components
import { ActionsComponent } from '../actions/actions.component'

@Component({
    selector: 'app-page',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, ActionsComponent],
    templateUrl: './page.component.html',
    styleUrl: './page.component.css',
})
export class PageComponent<TRow extends BaseDto> implements OnChanges {
    isScrolled = signal(false)
    actionList = signal([] as Action<TRow>[])
    @Input() title = ''
    @Input() editableTitle = false
    @Input() isLoading = false
    @Input() isAnimated = false
    @Input() showBackButton = false
    @Output() editTitleFunction = new EventEmitter<string>()
    @Input() actions: Action<TRow>[] = []
    @Input() addOptions?: Partial<Action<TRow>>
    @Input() filterOptions?: Partial<Action<TRow>>
    @Input() queryKey?: string

    constructor(private location: Location) {}

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes['actions'] ||
            changes['addOptions'] ||
            changes['filterOptions'] ||
            changes['queryKey']
        ) {
            this.actionList.set(this.parsedActions())
        }
    }

    goBack() {
        this.location.back()
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        const verticalOffset =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0

        if (verticalOffset > 100) this.isScrolled.set(true)
        else this.isScrolled.set(false)
    }

    faArrowLeft = faArrowLeft
    faRotateLeft = faRotateLeft
    faFilter = faFilter
    faAdd = faAdd

    parsedActions(): Action<TRow>[] {
        const parsed = [...(this.actions || [])]

        if (this.queryKey) {
            parsed.unshift({
                id: 'refresh',
                icon: faRotateLeft,
                tooltip: 'Refrescar',
                clicked: () => {
                    console.log('Refresh triggered')
                },
            })
        }

        if (this.addOptions) {
            parsed.unshift({
                ...this.addOptions,
                id: 'add',
                icon: faAdd,
            } as Action<TRow>)
        }

        if (this.filterOptions) {
            parsed.push({
                ...this.filterOptions,
                id: 'filter',
                icon: faFilter,
            } as Action<TRow>)
        }

        return parsed
    }
}
