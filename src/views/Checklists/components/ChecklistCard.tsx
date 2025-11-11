import { useTranslation } from 'react-i18next'

// components
import { ItemCard } from 'components'

// types
import type { ChecklistCardPropsType } from '../types'

export function ChecklistCard(props: ChecklistCardPropsType) {
  const { t } = useTranslation()

  const { id, onClick, actions, name, description, deleted } = props

  return (
    <ItemCard
      title={name}
      deleted={deleted}
      name={t('_pages:checklists.forms.edit')}
      aria-label={t('_pages:checklists.forms.editAria')}
      onClick={() => (!deleted ? onClick(id) : {})}
      actions={actions}
      containerClassName="w-100">
      <p
        className={`${description ? '' : '!text-xs italic'} text-start mb-2 ${
          deleted ? '!text-secondary' : ''
        }`}>
        {description ? description : t('_entities:base.description.empty')}
      </p>
      <div className="chip-container"></div>
    </ItemCard>
  )
}

