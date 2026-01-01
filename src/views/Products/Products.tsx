import { useLocation } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { parseQueries } from 'some-javascript-utils/browser'

// @sito-dashboard
import { useTableOptions } from '@sito/dashboard'
import type { TabsType } from '@sito/dashboard-app'
import {
  Page,
  useDeleteDialog,
  useExportActionMutate,
  useRestoreDialog,
  ConfirmationDialog,
  TabsLayout,
} from '@sito/dashboard-app'

// hooks
import { useAddProduct, useEditProduct } from './hooks'
import {
  ProductsQueryKeys,
  useChecklistsCommon,
  useProductCategoriesCommon,
} from 'hooks'

// components
import { AddProductDialog, EditProductDialog, ProductGrid } from './components'

// lib
import type { FilterProductDto, ProductDto } from 'lib/entities'
import { Tables } from 'lib/api'

// providers
import { useManager } from 'providers'

// styles
import './styles.css'

export function Products() {
  const { t } = useTranslation()

  const location = useLocation()

  const [tabValue, setTabValue] = useState<number>()

  const manager = useManager()

  const [showFilters, setShowFilters] = useState(false)

  // #region categories

  const categories = useProductCategoriesCommon()

  const parsedCategories = useMemo(
    () =>
      categories?.data?.map(category => ({
        ...category,
        name: category.name,
      })),
    [categories?.data, t]
  )

  // #endregion categories

  // #region checklists

  const checklists = useChecklistsCommon()

  const selectedChecklist = useMemo(
    () =>
      tabValue
        ? checklists.data?.find(
            checklist => checklist.id === Number(tabValue)
          ) ?? null
        : checklists.data?.[0] ?? null,
    [checklists.data, tabValue]
  )

  // #endregion checklists

  // #region actions

  const deleteProduct = useDeleteDialog({
    mutationFn: data => manager.Products.softDelete(data),
    ...ProductsQueryKeys.all(),
  })

  const restoreProduct = useRestoreDialog({
    mutationFn: data => manager.Products.restore(data),
    ...ProductsQueryKeys.all(),
  })

  const addProduct = useAddProduct({
    checklist: selectedChecklist,
  })

  const editProduct = useEditProduct()

  const { filters } = useTableOptions()

  const exportProducts = useExportActionMutate({
    entity: Tables.Products,
    mutationFn: () => manager.Products.export(filters),
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

  const getGridActions = useCallback(
    (record: ProductDto) => [
      deleteProduct.action(record),
      restoreProduct.action(record),
    ],
    [deleteProduct, restoreProduct]
  )

  const checklistDesktopTabs = useMemo(() => {
    return (checklists.data?.map(item => ({
      id: item.id,
      label: item.name,
      to: `?checklistId=${item.id}`,
      content: <>List here</>,
    })) ?? []) as TabsType[]
  }, [
    checklists.data,
    editProduct,
    getTableActions,
    parsedCategories,
    showFilters,
  ])

  const checklistMobileTabs = useMemo(() => {
    return (checklists.data?.map(item => ({
      id: item.id,
      label: item.name,
      content: (
        <ProductGrid
          checklistId={item.id}
          categories={parsedCategories ?? []}
          getActions={getGridActions}
          editAction={editProduct}
        />
      ),
    })) ?? []) as TabsType[]
  }, [checklists.data, editProduct, getGridActions, parsedCategories])

  useEffect(() => {
    const queries = parseQueries(location.search) as FilterProductDto

    if (queries.checklistId && !isNaN(queries.checklistId)) {
      const checklistId = Number(queries.checklistId)
      if (checklistDesktopTabs.find(tab => tab.id === checklistId))
        setTabValue(checklistId)
    }
  }, [checklistDesktopTabs, location])

  const pageToolbar = useMemo(() => {
    return [exportProducts.action()]
  }, [exportProducts])

  return (
    <Page
      title={t('_pages:products.title')}
      isLoading={checklists.isLoading || categories.isLoading}
      actions={pageToolbar}
      addOptions={{
        onClick: () => addProduct.openDialog(),
        disabled: checklists.isLoading,
        tooltip: t('_pages:products.add'),
      }}
      filterOptions={{
        onClick: () => setShowFilters(!showFilters),
        disabled: checklists.isLoading,
        tooltip: t('_accessibility:buttons.filters'),
      }}
      queryKey={ProductsQueryKeys.all().queryKey}>
      <TabsLayout
        defaultTab={tabValue}
        tabs={checklistDesktopTabs}
        className="h-full max-xs:hidden"
        tabsContainerClassName="checklist-tabs"
      />
      <TabsLayout
        defaultTab={tabValue}
        tabs={checklistMobileTabs}
        className="h-full min-xs:hidden"
        tabsContainerClassName="checklist-tabs"
      />

      {/* Dialogs */}
      <EditProductDialog {...editProduct} />
      <AddProductDialog {...addProduct} />
      <ConfirmationDialog {...deleteProduct} />
      <ConfirmationDialog {...restoreProduct} />

      {/* Category Dialogs */}
      {/* <EditProductDialog /> */}
    </Page>
  )
}
