import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from './app/app.config'
import { AppComponent } from './app/app.component'

// fonts
import '@fontsource/poppins'
import '@fontsource/roboto'

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err))
