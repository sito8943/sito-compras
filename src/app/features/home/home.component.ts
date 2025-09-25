import { Component, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PageComponent } from '../../shared/components/page/page.component'
import { CheckListStoreService } from '../../core/services/checklist-store.service'
import { CheckList } from '../../core/models/Checklist'
import { RouterLink } from '@angular/router'

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, PageComponent, RouterLink],
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
        console.log('add list')
        const newList: CheckList = {
            id: Date.now(),
            title: 'Nueva lista',
            completed: false,
            items: [],
        }
        this.checklistStore.addList(newList)
        this.lists.set(this.checklistStore.checklist())
    }
}
