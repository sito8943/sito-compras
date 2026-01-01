import type { CurrencyDto, UpdateCurrencyDto, AddCurrencyDto } from 'lib/entities'
import type { CurrencyFormType } from '../types'

export const formToDto = (data: CurrencyFormType): UpdateCurrencyDto => ({
  ...data,
})

export const formToAddDto = ({ id: _id, ...rest }: CurrencyFormType): AddCurrencyDto => {
  const { name, symbol, description, userId } = rest
  return { name, symbol, description, userId }
}

export const dtoToForm = (dto: CurrencyDto): CurrencyFormType => ({
  ...dto,
  userId: dto.user?.id ?? 0,
})

export const emptyCurrency: CurrencyFormType = {
  id: 0,
  name: '',
  description: '',
  symbol: '',
  userId: 0,
}
