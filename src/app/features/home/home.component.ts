import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PageComponent } from '../../shared/components/page/page.component'
import { CheckListStoreService } from '../../core/services/store.service'
import { CheckList } from '../../core/models/Checklist'

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, PageComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
    lists: CheckList[] = []
    constructor(private checklistStore: CheckListStoreService) {}

    ngOnInit() {
        this.lists = this.checklistStore.checklist()
    }
}
