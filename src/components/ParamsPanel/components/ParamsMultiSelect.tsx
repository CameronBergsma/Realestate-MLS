import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FixedSizeList } from 'react-window'

import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'

import ParamLabel from './ParamsLabel'

const endIconStyles = {
  px: 1,
  top: 2,
  right: 4,
  height: 26,
  zIndex: 2,
  flex: 1,
  position: 'absolute',
  bgcolor: 'background.paper'
}

const checkboxStyles = {
  '&.MuiCheckbox-root': { py: 0, pl: 0 },
  '& .MuiSvgIcon-root': { fontSize: 20 }
}

const ITEM_HEIGHT = 36
const MENU_MAX_HEIGHT = 250

const ParamsMultiSelect = ({
  name,
  label,
  hint,
  link,
  tooltip,
  loading,
  options = [],
  noNull = true,
  noClear = false,
  stringValue = false,
  onChange
}: {
  name: string
  label?: string
  hint?: string
  link?: string
  tooltip?: string
  loading?: boolean
  options: readonly string[]
  noNull?: boolean
  noClear?: boolean
  stringValue?: boolean
  onChange?: () => void
}) => {
  const {
    control,
    setValue,
    formState: { errors }
  } = useFormContext()

  const [searchTerm, setSearchTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  const handleClearClick = () => {
    setValue(name, stringValue ? '' : [])
    onChange?.()
  }

  const filteredOptions = options.filter(
    (option) =>
      option && option.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const MenuItemRow = ({ index, style }: { index: number; style: any }) => {
    const option = filteredOptions[index]
    return (
      <MenuItem key={option} value={option} style={style}>
        <Checkbox
          size="small"
          sx={checkboxStyles}
          checked={localValue.includes(option)}
        />
        {option}
      </MenuItem>
    )
  }

  return (
    <Box flex={1} sx={{ position: 'relative' }}>
      <ParamLabel
        label={label}
        nameFor={name}
        hint={hint}
        link={link}
        tooltip={tooltip}
      />
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const valueAsArray = stringValue
            ? field.value
              ? String(field.value)
                  .split(',')
                  .map((v) => v.trim())
              : []
            : field.value || []

          const [localValue, setLocalValue] = useState<string[]>(valueAsArray)
          useEffect(() => {
            setLocalValue(valueAsArray)
          }, [field.value])

          return (
            <Box sx={{ position: 'relative' }}>
              <TextField
                id={name}
                select
                fullWidth
                size="small"
                error={!!errors[name]}
                helperText={errors[name]?.message?.toString()}
                {...field}
                value={[...localValue].flat()}
                onChange={(e) => {
                  const newValue = e.target.value
                  setLocalValue([...newValue])
                }}
                onClose={() => {
                  setMenuOpen(false)
                  field.onChange(
                    stringValue ? localValue.join(',') : localValue
                  )
                  onChange?.()
                }}
                SelectProps={{
                  multiple: true,
                  displayEmpty: true,
                  open: menuOpen,
                  onOpen: () => setMenuOpen(true),
                  onClose: () => setMenuOpen(false),
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: MENU_MAX_HEIGHT
                      }
                    }
                  },
                  renderValue: (selected) => {
                    if (
                      !selected ||
                      (Array.isArray(selected) && selected.length === 0)
                    ) {
                      return (
                        <Typography variant="body2\" color="#CCC">
                          null
                        </Typography>
                      )
                    }
                    return (
                      <Box
                        sx={{
                          maxWidth: '100%',
                          overflow: 'hidden',
                          py: 0.25,
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {Array.isArray(selected)
                          ? selected.join(',')
                          : String(selected)}
                      </Box>
                    )
                  }
                }}
                InputProps={{
                  startAdornment: menuOpen && (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'action.active', ml: 1 }} />
                      <TextField
                        size="small"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          '& .MuiInputBase-root': {
                            bgcolor: 'transparent',
                            '&:hover': {
                              bgcolor: 'transparent'
                            }
                          }
                        }}
                      />
                    </InputAdornment>
                  )
                }}
              >
                {!noNull && (
                  <MenuItem value="">
                    <span style={{ color: '#aaa' }}>null</span>
                  </MenuItem>
                )}
                <FixedSizeList
                  height={Math.min(
                    filteredOptions.length * ITEM_HEIGHT,
                    MENU_MAX_HEIGHT
                  )}
                  width="100%"
                  itemCount={filteredOptions.length}
                  itemSize={ITEM_HEIGHT}
                  overscanCount={5}
                >
                  {MenuItemRow}
                </FixedSizeList>
              </TextField>

              {Boolean(!noClear && localValue.length > 0) && !loading && (
                <Box sx={endIconStyles}>
                  <Tooltip title="Clear">
                    <IconButton
                      onClick={handleClearClick}
                      sx={{ p: 0.5, mr: '-8px', mt: '-7px' }}
                    >
                      <ClearIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              {loading && (
                <Box sx={endIconStyles}>
                  <CircularProgress size={14} />
                </Box>
              )}
            </Box>
          )
        }}
      />
    </Box>
  )
}

export default ParamsMultiSelect

export { endIconStyles }