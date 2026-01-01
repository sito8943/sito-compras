import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

// @sito-dashboard
import {
  Page,
  useDeleteDialog,
  useExportActionMutate,
  useRestoreDialog,
  ConfirmationDialog,
  GlobalActions,
  PrettyGrid,
  Empty,
  Error,
} from '@sito/dashboard-app'

// hooks
import { useAddProduct, useEditProduct } from './hooks'
import { ProductsQueryKeys, useProductsList } from 'hooks'

// components
import { AddProductDialog, EditProductDialog, ProductCard } from './components'

// lib
import type { ProductDto } from 'lib/entities'
import { Tables } from 'lib/api'

// providers
import { useManager } from 'providers'

// icons
import { faAdd, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// styles
import './styles.css'

export function Products() {
  const { t } = useTranslation()

  const manager = useManager()

  const { data, isLoading, error } = useProductsList({})

  // #region actions

  const deleteProduct = useDeleteDialog({
    mutationFn: data => manager.Products.softDelete(data),
    ...ProductsQueryKeys.all(),
  })

  const restoreProduct = useRestoreDialog({
    mutationFn: data => manager.Products.restore(data),
    ...ProductsQueryKeys.all(),
  })

  const addProduct = useAddProduct({})

  const editProduct = useEditProduct()

  const exportProducts = useExportActionMutate({
    entity: Tables.Products,
    mutationFn: () => manager.Products.export(),
  })

  // #endregion

  const getTableActions = useCallback(
    (record: ProductDto) => [
      editProduct.action(record),
      deleteProduct.action(record),
      restoreProduct.action(record),
    ],
    [deleteProduct, editProduct, restoreProduct]
  )

  const pageToolbar = useMemo(() => {
    return [exportProducts.action()]
  }, [exportProducts])

  return (
    <Page
      title={t('_pages:products.title')}
      isLoading={isLoading}
      actions={pageToolbar}
      addOptions={{
        onClick: () => addProduct.openDialog(),
        disabled: isLoading,
        tooltip: t('_pages:products.add'),
      }}
      queryKey={ProductsQueryKeys.all().queryKey}>
      {!error ? (
        <PrettyGrid
          data={data?.items}
          emptyComponent={
            <Empty
              message={t('_pages:products.empty')}
              iconProps={{
                icon: faCartShopping,
                className: 'text-5xl max-md:text-3xl text-gray-400',
              }}
              action={{
                icon: <FontAwesomeIcon icon={faAdd} />,
                id: GlobalActions.Add,
                disabled: isLoading,
                onClick: () => addProduct.openDialog(),
                tooltip: t('_pages:products.add'),
              }}
            />
          }
          renderComponent={product => (
            <ProductCard
              actions={getTableActions(product)}
              onClick={(id: number) => editProduct.openDialog(id)}
              {...product}
            />
          )}
        />
      ) : (
        <Error error={error} />
      )}

      {/* Dialogs */}
      <EditProductDialog {...editProduct} />
      <AddProductDialog {...addProduct} />
      <ConfirmationDialog {...deleteProduct} />
      <ConfirmationDialog {...restoreProduct} />
    </Page>
  )
}

