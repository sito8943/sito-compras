import { Component, HostListener, signal, Input } from '@angular/core'
import { CommonModule, Location } from '@angular/common'

// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

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
    @Input() isLoading = false
    @Input() isAnimated = false
    @Input() showBackButton = false

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
}
