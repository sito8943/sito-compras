import { useTranslation } from 'react-i18next'

// @sito/dashboard
import { Chip } from '@sito/dashboard'

// components
import { ItemCard } from 'components'

// types
import type { ProductCardPropsType } from '../types'

// views
import { Currency } from 'views'

export function ProductCard(props: ProductCardPropsType) {
  const { t } = useTranslation()

  const {
    id,
    name,
    onClick,
    actions,
    description,
    price,
    category,
    checklist,
    deleted,
  } = props

  return (
    <ItemCard
      title={name}
      deleted={deleted}
      name={t('_pages:checklists.forms.edit')}
      aria-label={t('_pages:checklists.forms.editAria')}
      onClick={() => (!deleted ? onClick(id) : {})}
      actions={actions}>
      <p
        className={`${description ? '' : '!text-xs italic'} text-start mb-2 ${
          deleted ? '!text-secondary' : ''
        }`}>
        {description}
      </p>
      <div className="chip-container">
        <Chip
          label={
            <>
              {price}{' '}
              <Currency
                name={checklist?.currency?.name}
                symbol={checklist?.currency?.symbol}
              />
            </>
          }
        />
      </div>
    </ItemCard>
  )
}

