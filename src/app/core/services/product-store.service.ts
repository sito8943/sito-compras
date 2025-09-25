import { Injectable, signal } from '@angular/core'
import { LocalStorageService } from './local-storage.service'
import { Product } from '../models/Product'

@Injectable({
    providedIn: 'root',
})
export class ProductStoreService {
    private readonly STORAGE_KEY = 'products'

    // Estado reactivo con signals
    products = signal<Product[]>([])

    constructor(private localStorage: LocalStorageService) {
        this.load()
    }

    private load() {
        const data = this.localStorage.getItem<Product[]>(this.STORAGE_KEY)
        if (data) {
            this.products.set(data)
        }
    }

    private persist() {
        this.localStorage.setItem(this.STORAGE_KEY, this.products())
    }

    addProduct(product: Product) {
        this.products.update(products => [...products, product])
        this.persist()
    }

    removeProduct(id: number) {
        this.products.update(products => products.filter(p => p.id !== id))
        this.persist()
    }

    getProductsByListId(listId: number) {
        return this.products().filter(p => p.checklistId === listId)
    }

    clear() {
        this.products.set([])
        this.localStorage.removeItem(this.STORAGE_KEY)
    }
}
