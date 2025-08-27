import { Component, HostListener, signal } from '@angular/core'
import { CommonModule } from '@angular/common'

// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

// components
import { ClockComponent } from './clock/clock.component'

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, ClockComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent {
    isScrolled = signal(false)

    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        const verticalOffset =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0
        console.log(verticalOffset)
        if (verticalOffset > 100) this.isScrolled.set(true)
        else this.isScrolled.set(false)
    }

    faBars = faBars

    openDrawer() {
        // Logic to open the drawer
    }
}
