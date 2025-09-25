import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'

// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { Product } from '../../../core/models/Product'

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
})
export class ProductsComponent {
    @Input() products: Product[] = []
    @Output() add = new EventEmitter<void>()
    @Output() remove = new EventEmitter<number>()
}
