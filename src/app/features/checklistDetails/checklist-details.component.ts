import { Component, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router'

// models
import { Product } from '../../core/models/Product'

// services
import { ProductStoreService } from '../../core/services/product-store.service'
import { CheckListStoreService } from '../../core/services/checklist-store.service'

// components
import { PageComponent } from '../../shared/components/page/page.component'
import { ProductsComponent } from '../../shared/components/products/products.component'
import { Action } from '../../core/types/Action'

@Component({
    selector: 'app-checklist-details',
    standalone: true,
    imports: [CommonModule, PageComponent, ProductsComponent],
    templateUrl: './checklist-details.component.html',
    styleUrl: './checklist-details.component.css',
})
export class ChecklistDetailsComponent implements OnInit {
    id = signal<number | null>(null)
    listTitle = signal<string>('')
    products = signal<Product[]>([])

    constructor(
        private route: ActivatedRoute,
        private productStore: ProductStoreService,
        private checklistStore: CheckListStoreService
    ) {}

    ngOnInit() {
        const currentId = this.route.snapshot.paramMap.get('id')
        this.id.set(Number(currentId)!)

        if (currentId) {
            this.listTitle.set(
                this.checklistStore
                    .checklist()
                    .find(l => l.id === Number(currentId))?.title ?? ''
            )
            this.products.set(
                this.productStore.getProductsByListId(Number(currentId))
            )
        }
    }

    editTitle(newTitle: string) {
        this.listTitle.set(newTitle)
        this.checklistStore.updateChecklistTitle(this.id(), newTitle)
    }

    addProduct() {
        if (!this.id()) return

        const now = new Date()
        const newProduct: Product = {
            id: Date.now(),
            checklistId: this.id() ?? 0,
            name: 'Nuevo Producto',
            price: 0,
            count: 1,
            description: '',
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            deleted: false,
        }
        this.productStore.addProduct(newProduct)
        this.products.set(
            this.productStore.getProductsByListId(Number(this.id() ?? 0))
        )
    }

    removeProduct(productId: number) {
        if (!this.id()) return
        this.productStore.removeProduct(productId)
    }

    addAction: Partial<Action<Product>> = {
        id: 'add',
        tooltip: 'Añadir Producto',
        clicked: () => this.addProduct(),
    }
}
