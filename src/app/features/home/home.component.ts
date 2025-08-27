import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PageComponent } from '../../shared/components/page/page.component'

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, PageComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent {}
