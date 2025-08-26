import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ClockComponent } from './clock.component'

describe('ClockComponent', () => {
    console.log('ClockComponent test - INIT')
    let component: ClockComponent
    let fixture: ComponentFixture<ClockComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ClockComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ClockComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        console.log('ClockComponent - should create')
        expect(component).toBeTruthy()
    })
    console.log('ClockComponent test - STOP')
})
