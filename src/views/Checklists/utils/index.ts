import type {
  ChecklistDto,
  AddChecklistDto,
  UpdateChecklistDto,
} from 'lib/entities'
import type { ChecklistFormType } from '../types'

export const formToUpdateDto = ({
  currency,
  userId,
  ...rest
}: ChecklistFormType): UpdateChecklistDto => {
  return {
    ...rest,
    userId: userId,
  }
}

export const formToAddDto = ({
  currency,
  userId,
  ...rest
}: ChecklistFormType): AddChecklistDto => {
  return {
    ...rest,
    userId: userId,
  }
}

export const dtoToForm = (dto: ChecklistDto): ChecklistFormType => ({
  ...dto,
  userId: dto.user?.id ?? 0,
})

export const emptyChecklist = (userId = 0): ChecklistFormType => ({
  id: 0,
  name: '',
  description: '',
  userId,
})
