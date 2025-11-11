// @sito/dashboard
import type { DeleteDto } from '@sito/dashboard-app'

// types
import type { AddChecklistDto } from './AddChecklistDto'

export interface UpdateChecklistDto extends DeleteDto, AddChecklistDto {}

