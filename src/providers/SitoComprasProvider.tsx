import { useTranslation } from 'react-i18next'

// @sito/dashboard-app
import { TranslationProvider } from '@sito/dashboard'
import { AuthProvider, NotificationProvider } from '@sito/dashboard-app'

import { type BasicProviderPropTypes } from './types'

import { SCManagerProvider } from './SCManagerProvider'
import { LocalCacheProvider } from './LocalCacheProvider'

// config
import { config } from '../config'

export const SitoComprasProvider = ({ children }: BasicProviderPropTypes) => {
  const authConfig = config.auth

  const { t } = useTranslation()

  return (
    <SCManagerProvider>
      <LocalCacheProvider>
        <TranslationProvider t={t} language="">
          <NotificationProvider>
            <AuthProvider {...authConfig}>{children}</AuthProvider>
          </NotificationProvider>
        </TranslationProvider>
      </LocalCacheProvider>
    </SCManagerProvider>
  )
}

