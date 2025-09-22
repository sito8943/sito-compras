import { Injectable, signal } from '@angular/core'

// services
import { LocalStorageService } from './local-storage.service'

// models
import { CheckList } from '../models/Checklist'

@Injectable({
    providedIn: 'root',
})
export class CheckListStoreService {
    private readonly STORAGE_KEY = 'checklist'

    // Estado reactivo con signals
    checklist = signal<CheckList[]>([])

    constructor(private localStorage: LocalStorageService) {
        this.load()
    }

    private load() {
        const data = this.localStorage.getItem<CheckList[]>(this.STORAGE_KEY)
        if (data) {
            this.checklist.set(data)
        }
    }

    private persist() {
        this.localStorage.setItem(this.STORAGE_KEY, this.checklist())
    }

    addList(list: CheckList) {
        this.checklist.update(lists => [...lists, list])
        this.persist()
    }

    removeList(title: string) {
        this.checklist.update(lists => lists.filter(l => l.title !== title))
        this.persist()
    }

    clear() {
        this.checklist.set([])
        this.localStorage.removeItem(this.STORAGE_KEY)
    }
}
