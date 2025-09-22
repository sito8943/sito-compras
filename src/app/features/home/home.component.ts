import { Component, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'

// components
import { PageComponent } from '../../shared/components/page/page.component'

// services
import { CheckListStoreService } from '../../core/services/store.service'

// models
import { CheckList } from '../../core/models/Checklist'

// types
import { Action } from '../../core/types/Action'

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, PageComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
    lists = signal<CheckList[]>([])

    constructor(private checklistStore: CheckListStoreService) {}

    ngOnInit() {
        this.lists.set(this.checklistStore.checklist())
    }

    addList() {
        console.log('hola?')
        const now = new Date()
        const newList: CheckList = {
            id: Date.now(),
            title: 'Nueva lista',
            completed: false,
            items: [],
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            deleted: false,
        }
        this.checklistStore.addList(newList)
        console.log(this.checklistStore.checklist())
        this.lists.set(this.checklistStore.checklist())
    }

    addAction: Partial<Action<CheckList>> = {
        id: 'add',
        tooltip: 'Añadir lista',
        clicked: () => this.addList(),
    }
}
