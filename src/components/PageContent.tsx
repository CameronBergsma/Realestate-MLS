import { useState } from 'react'

import { Stack } from '@mui/material'

import ParamsFormProvider from 'providers/ParamsFormProvider'
import SelectOptionsProvider from 'providers/SelectOptionsProvider'
import { apiFields, apiFieldsMappings } from 'constants/form'

import MapPanel from './MapPanel'
import ParamsPanel from './ParamsPanel'

const PageContent = () => {
  const [expandedResponse] = useState(false)

  return (
    <Stack
      spacing={2.5}
      direction="row"
      justifyContent="stretch"
      sx={{ height: 'calc(100vh - 69px)', minHeight: 500, p: 2 }}
    >
      <SelectOptionsProvider fields={apiFields} mappings={apiFieldsMappings}>
        <ParamsFormProvider>
          <ParamsPanel />
          <MapPanel collapsed={expandedResponse} />
        </ParamsFormProvider>
      </SelectOptionsProvider>
    </Stack>
  )
}

export default PageContent