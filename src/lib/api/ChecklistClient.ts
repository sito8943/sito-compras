import { BaseClient } from '@sito/dashboard-app'

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
  }
}
