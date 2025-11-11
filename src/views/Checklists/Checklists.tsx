import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

// @sito/dashboard-app
import {
  useDeleteDialog,
  useRestoreDialog,
  useExportActionMutate,
  GlobalActions,
  PrettyGrid,
  Page,
  Empty,
  Error,
  ConfirmationDialog,
  useImportDialog,
} from '@sito/dashboard-app'

// providers
import { useManager } from 'providers'

// icons
import { faAdd, faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// components
import {
  AddChecklistDialog,
  ChecklistCard,
  EditChecklistDialog,
} from './components'

// hooks
import { useChecklistsList, ChecklistsQueryKeys } from 'hooks'
import { useAddChecklistDialog, useEditChecklistDialog } from './hooks'

// types
import type { ChecklistDto } from 'lib/models'
import { Tables } from 'lib/api'

export function Checklists() {
  const { t } = useTranslation()

  const manager = useManager()

  const { data, isLoading, error } = useChecklistsList({})

  // #region actions

  const deleteChecklist = useDeleteDialog({
    mutationFn: data => manager.Checklists.softDelete(data),
    ...ChecklistsQueryKeys.all(),
  })

  const restoreChecklist = useRestoreDialog({
    mutationFn: data => manager.Checklists.restore(data),
    ...ChecklistsQueryKeys.all(),
  })

  const addChecklist = useAddChecklistDialog()

  const editChecklist = useEditChecklistDialog()

  const exportChecklists = useExportActionMutate({
    entity: Tables.Checklists,
    mutationFn: () => manager.Checklists.export(),
  })

  const importChecklists = useImportDialog({
    entity: Tables.Checklists,
    mutationFn: data => manager.Checklists.import(data),
    ...ChecklistsQueryKeys.all(),
  })

  // #endregion

  const getActions = useCallback(
    (record: ChecklistDto) => [
      deleteChecklist.action(record),
      restoreChecklist.action(record),
    ],
    [deleteChecklist, restoreChecklist]
  )

  const pageToolbar = useMemo(() => {
    return [importChecklists.action(), exportChecklists.action()]
  }, [exportChecklists, importChecklists])

  return (
    <Page
      title={t('_pages:checklists.title')}
      isLoading={isLoading}
      actions={pageToolbar}
      addOptions={{
        onClick: () => addChecklist.openDialog(),
        disabled: isLoading,
        tooltip: t('_pages:checklists.add'),
      }}
      queryKey={ChecklistsQueryKeys.all().queryKey}>
      {!error ? (
        <>
          <PrettyGrid
            data={data?.items}
            emptyComponent={
              <Empty
                message={t('_pages:checklists.empty')}
                iconProps={{
                  icon: faWallet,
                  className: 'text-5xl max-md:text-3xl text-gray-400',
                }}
                action={{
                  icon: <FontAwesomeIcon icon={faAdd} />,
                  id: GlobalActions.Add,
                  disabled: isLoading,
                  onClick: () => addChecklist.openDialog(),
                  tooltip: t('_pages:checklists.add'),
                }}
              />
            }
            renderComponent={checklist => (
              <ChecklistCard
                actions={getActions(checklist)}
                onClick={(id: number) => editChecklist.openDialog(id)}
                {...checklist}
              />
            )}
          />
          {/* Dialogs */}
          <AddChecklistDialog {...addChecklist} />
          <EditChecklistDialog {...editChecklist} />
          <ConfirmationDialog {...deleteChecklist} />
          <ConfirmationDialog {...restoreChecklist} />
        </>
      ) : (
        <Error error={error} />
      )}
    </Page>
  )
}

