import { useTranslation } from 'react-i18next'

// @sito/dashboard
import { PrettyGrid, Error } from '@sito/dashboard-app'

// components
import { ProductCard } from '../ProductCard'

// types
import type { ProductContainerPropsType } from './types'

// hooks
import { useProductsList } from 'hooks'

export const ProductGrid = (props: ProductContainerPropsType) => {
  const { t } = useTranslation()

  const { checklistId, getActions, editAction } = props

  const { data, isLoading, error } = useProductsList({
    filters: { checklistId },
  })

  return error ? (
    <Error error={error} />
  ) : (
    <PrettyGrid
      data={data?.items}
      emptyMessage={t('_pages:products.empty')}
      loading={isLoading}
      renderComponent={product => (
        <ProductCard
          actions={getActions(product)}
          onClick={(id: number) => editAction.openDialog(id)}
          {...product}
        />
      )}
    />
  )
}

