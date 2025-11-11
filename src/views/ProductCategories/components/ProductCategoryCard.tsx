import { useTranslation } from 'react-i18next'

// components
import { ItemCard } from 'components'

// types
import type { ProductCategoryCardPropsType } from '../types'

export function ProductCategoryCard(props: ProductCategoryCardPropsType) {
  const { t } = useTranslation()

  const { id, onClick, actions, name, description, deleted } = props

  return (
    <ItemCard
      title={name}
      deleted={deleted}
      name={t('_pages:productCategory.forms.edit')}
      aria-label={t('_pages:productCategory.forms.editAria')}
      onClick={() => (!deleted ? onClick(id) : {})}
      actions={actions}>
      <p
        className={`${description ? '' : '!text-xs italic'} text-start mb-2 ${
          deleted ? '!text-secondary' : ''
        }`}>
        {description}
      </p>
    </ItemCard>
  )
}

