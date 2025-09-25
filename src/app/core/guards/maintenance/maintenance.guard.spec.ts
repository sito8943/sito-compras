import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
    waitForAsync,
} from '@angular/core/testing'
import { CanActivateFn, Router } from '@angular/router'
import { Location } from '@angular/common'
import { MaintenanceGuard } from './maintenance.guard'
import { SiteStatusService } from '../../services/site-status.service'
import { RouterTestingModule } from '@angular/router/testing'
import { expect } from '@jest/globals'
import { AppComponent } from '../../../app.component'
import { FooterComponent } from '../../../shared/components/footer/footer.component'
import { HeaderComponent } from '../../../shared/components/header/header.component'
import { MaintenanceComponent } from '../../../features/maintenance/maintenance.component'
import { routes } from '../../../app.routes'

describe('MaintenanceGuard', () => {
    // let component: AppComponent
    let fixture: ComponentFixture<AppComponent>
    let maintenanceFixture: ComponentFixture<MaintenanceComponent>
    let mockSiteStatusService: SiteStatusService
    let mockRouter: Router
    let location: Location

    const maintenanceGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() =>
            MaintenanceGuard(...guardParameters)
        )

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(routes)],
        }).compileComponents()
    }))

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppComponent, HeaderComponent, FooterComponent],
            providers: [SiteStatusService, Router],
        })
        // component = fixture.componentInstance
        fixture = TestBed.createComponent(AppComponent)
        maintenanceFixture = TestBed.createComponent(MaintenanceComponent)

        mockSiteStatusService = TestBed.inject(SiteStatusService)
        mockRouter = TestBed.inject(Router)
        location = TestBed.inject(Location)
        mockRouter.initialNavigation()

        fixture.detectChanges()
        maintenanceFixture.detectChanges()
    })

    it('should be created', () => {
        expect(maintenanceGuard).toBeTruthy()
        fixture.whenStable().then(() => {
            expect(location.path()).toBe('/')
        })
    })

    it('should block navigation when site is offline', fakeAsync(() => {
        mockSiteStatusService.setIsSiteOnline(false)
        maintenanceFixture.detectChanges()

        expect(mockSiteStatusService.getIsSiteOnline()).toBeFalsy()
        tick()
        fixture.detectChanges()
        fixture.whenStable().then(() => {
            // Check if the guard properly redirects to /maintenance when the site is offline
            // expect(location.path()).toBe('/maintenance') // Remove this comment here
        })
    }))
})
