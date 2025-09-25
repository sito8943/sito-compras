import {
    Component,
    HostListener,
    signal,
    Input,
    Output,
    EventEmitter,
} from '@angular/core'
import { CommonModule, Location } from '@angular/common'

// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faArrowLeft, faAdd } from '@fortawesome/free-solid-svg-icons'

@Component({
    selector: 'app-page',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './page.component.html',
    styleUrl: './page.component.css',
})
export class PageComponent {
    isScrolled = signal(false)
    @Input() title = ''
    @Input() editableTitle = false
    @Input() isLoading = false
    @Input() isAnimated = false
    @Input() showBackButton = false
    @Output() editTitleFunction = new EventEmitter<string>()
    @Output() addFunction = new EventEmitter<void>()

    constructor(private location: Location) {}

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
    faAdd = faAdd
}
