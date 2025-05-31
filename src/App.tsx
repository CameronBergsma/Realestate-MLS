import { useMemo } from 'react'
import queryString from 'query-string'

import { ThemeProvider } from '@mui/system'

import PageContent from 'components/PageContent'

import MapOptionsProvider, {
  type MapCoords
} from 'providers/MapOptionsProvider'
import SearchProvider from 'providers/SearchProvider'

import theme from 'styles/theme'
import './App.css'

import { formatBooleanFields, formatMultiSelectFields } from './utils'

function App() {
  const urlParams = queryString.parse(window.location.search)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lat, lng, zoom, ...filteredParams } = urlParams // remove mapbox coords

  const mapParams = useMemo(() => ({ lat, lng, zoom }) as MapCoords, [])

  const searchParams = useMemo(() => {
    const boolParams = formatBooleanFields(filteredParams)
    const boolAndArrayParams = formatMultiSelectFields(boolParams)
    return boolAndArrayParams
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <SearchProvider params={searchParams}>
        <MapOptionsProvider style="map" params={mapParams}>
          <PageContent />
        </MapOptionsProvider>
      </SearchProvider>
    </ThemeProvider>
  )
}

export default App