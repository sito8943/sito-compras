import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

// utils
import { getFormattedDateTime } from '../../../../core/utils/date'

@Component({
    selector: 'app-clock',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './clock.component.html',
    styleUrl: './clock.component.css',
})
export class ClockComponent {
    dateNow: string = getFormattedDateTime()

    constructor() {
        setInterval(() => {
            this.dateNow = getFormattedDateTime()
        }, 1000)
    }
}
