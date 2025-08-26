import { Component } from '@angular/core'
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
    faBars = faBars

    openDrawer() {
        // Logic to open the drawer
    }
}
