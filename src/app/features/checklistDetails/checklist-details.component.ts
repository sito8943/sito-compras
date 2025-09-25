import { Component, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PageComponent } from '../../shared/components/page/page.component'
import { ActivatedRoute } from '@angular/router'
import { ProductsComponent } from '../../shared/components/products/products.component'
import { Product } from '../../core/models/Product'
import { ProductStoreService } from '../../core/services/product-store.service'
import { CheckListStoreService } from '../../core/services/checklist-store.service'

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

        console.log(currentId, typeof currentId)

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
        const newProduct: Product = {
            id: Date.now(),
            checklistId: this.id() ?? 0,
            name: 'Nuevo Producto',
            price: 0,
            count: 1,
            description: '',
        }
        this.productStore.addProduct(newProduct)
    }

    removeProduct(productId: number) {
        if (!this.id()) return
        this.productStore.removeProduct(productId)
    }
}
