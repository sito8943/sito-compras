import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

// @sito-dashboard
import {
  Page,
  PrettyGrid,
  Empty,
  Error,
  useDeleteDialog,
  useRestoreDialog,
  useExportActionMutate,
  GlobalActions,
  ConfirmationDialog,
} from '@sito/dashboard-app'

// icons
import { faAdd, faTags } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// providers
import { useManager } from 'providers'

// components]
import {
  AddProductCategoryDialog,
  ProductCategoryCard,
  EditProductCategoryDialog,
} from './components'

// hooks
import { useProductCategoriesList, ProductCategoriesQueryKeys } from 'hooks'
import {
  useAddProductCategoryDialog,
  useEditProductCategoryDialog,
} from './hooks'

// types
import type { ProductCategoryDto } from 'lib/models'
import { Tables } from 'lib/api'

export function ProductCategories() {
  const { t } = useTranslation()

  const manager = useManager()

  const { data, isLoading, error } = useProductCategoriesList({})

  // #region actions

  const deleteProductCategory = useDeleteDialog({
    mutationFn: data => manager.ProductCategories.softDelete(data),
    ...ProductCategoriesQueryKeys.all(),
  })

  const restoreProductCategory = useRestoreDialog({
    mutationFn: data => manager.ProductCategories.restore(data),
    ...ProductCategoriesQueryKeys.all(),
  })

  const addProductCategory = useAddProductCategoryDialog()

  const editProductCategory = useEditProductCategoryDialog()

  const exportProductCategory = useExportActionMutate({
    entity: Tables.ProductCategories,
    mutationFn: () => manager.ProductCategories.export(),
  })

  // #endregion

  const getActions = useCallback(
    (record: ProductCategoryDto) => [
      deleteProductCategory.action(record),
      restoreProductCategory.action(record),
    ],
    [deleteProductCategory, restoreProductCategory]
  )

  const pageToolbar = useMemo(() => {
    return [exportProductCategory.action()]
  }, [exportProductCategory])

  return (
    <Page
      title={t('_pages:productCategories.title')}
      isLoading={isLoading}
      actions={pageToolbar}
      addOptions={{
        onClick: () => addProductCategory.openDialog(),
        disabled: isLoading,
        tooltip: t('_pages:productCategories.add'),
      }}
      queryKey={ProductCategoriesQueryKeys.all().queryKey}>
      {!error ? (
        <>
          <PrettyGrid
            data={data?.items}
            emptyComponent={
              <Empty
                message={t('_pages:productCategories.empty')}
                iconProps={{
                  icon: faTags,
                  className: 'text-5xl max-md:text-3xl text-gray-400',
                }}
                action={{
                  icon: <FontAwesomeIcon icon={faAdd} />,
                  id: GlobalActions.Add,
                  disabled: isLoading,
                  onClick: () => addProductCategory.openDialog(),
                  tooltip: t('_pages:productCategories.add'),
                }}
              />
            }
            renderComponent={productCategory => (
              <ProductCategoryCard
                actions={getActions(productCategory)}
                onClick={(id: number) => editProductCategory.openDialog(id)}
                {...productCategory}
              />
            )}
          />
          {/* Dialogs */}
          <AddProductCategoryDialog {...addProductCategory} />
          <EditProductCategoryDialog {...editProductCategory} />
          <ConfirmationDialog {...deleteProductCategory} />
          <ConfirmationDialog {...restoreProductCategory} />
        </>
      ) : (
        <Error error={error} />
      )}
    </Page>
  )
}

