import { BaseClient } from '@sito/dashboard-app'
import { SupabaseAPIClient } from './SupabaseAPIClient'

// enum
import { Tables } from './types'

// types
import type {
  CommonChecklistDto,
  ChecklistDto,
  UpdateChecklistDto,
  FilterChecklistDto,
  AddChecklistDto,
} from 'lib/entities'

// config
import { config } from '../../config'

export default class ChecklistClient extends BaseClient<
  Tables,
  ChecklistDto,
  CommonChecklistDto,
  AddChecklistDto,
  UpdateChecklistDto,
  FilterChecklistDto
> {
  /**
   */
  constructor() {
    super(Tables.Checklists, config.apiUrl, config.auth.user)
    // swap transport to Supabase while keeping BaseClient API
    this.api = new SupabaseAPIClient(config.apiUrl, config.auth.user, true) as unknown as typeof this.api
  }
}
