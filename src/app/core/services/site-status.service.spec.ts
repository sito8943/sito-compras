import { TestBed } from '@angular/core/testing'
import { SiteStatusService } from './site-status.service'
import { expect } from '@jest/globals'

describe('SiteStatusService', () => {
    let mockSiteStatusService: SiteStatusService

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SiteStatusService],
        })
        mockSiteStatusService = TestBed.inject(SiteStatusService)
    })

    it('should be created', () => {
        expect(mockSiteStatusService).toBeTruthy()
    })

    it('should return True as SiteStatus', () => {
        expect(mockSiteStatusService.getIsSiteOnline()).toBeTruthy()
    })

    it('should change to False the SiteStatus', () => {
        mockSiteStatusService.setIsSiteOnline(false)
        expect(mockSiteStatusService.getIsSiteOnline()).toBeFalsy()
    })
})
