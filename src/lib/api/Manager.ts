// @sito/dashboard-app
import { IManager } from '@sito/dashboard-app'

// config
import { config } from '../../config'

export class Manager extends IManager {
  constructor() {
    super(config.apiUrl, config.auth.user)
  }
}

