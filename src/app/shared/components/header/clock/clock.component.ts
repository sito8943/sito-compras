import { Component, OnInit, OnDestroy, signal } from '@angular/core'
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
export class ClockComponent implements OnInit, OnDestroy {
    dateNow = signal(getFormattedDateTime())
    private intervalId?: number

    ngOnInit() {
        this.intervalId = window.setInterval(() => {
            this.dateNow.set(getFormattedDateTime())
        }, 1000)
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }
}
