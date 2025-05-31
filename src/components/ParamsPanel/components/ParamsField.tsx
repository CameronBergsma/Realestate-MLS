import React, { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
  Tooltip
} from '@mui/material'

import ParamLabel from './ParamsLabel'

type InputProps = TextFieldProps & {
  name: string
  label?: string
  hint?: string
  link?: string
  tooltip?: string
  noClear?: boolean
  disabled?: boolean
  onChange?: () => void
  searchable?: boolean
}

const ParamsField: React.FC<InputProps> = ({
  name,
  label,
  hint,
  link,
  tooltip,
  type = 'text',
  noClear = false,
  onChange,
  searchable = false,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const {
    trigger,
    register,
    setValue,
    getValues,
    formState: { errors }
  } = useFormContext()
  const value = getValues(name)

  const handleFocus = () => {
    setIsFocused(true)
    trigger(name)
    onChange?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault() // Prevent form submission
      onChange?.()
    }
  }

  const handleClearClick = () => {
    setValue(name, '')
    inputRef.current?.focus()
    onChange?.()
  }

  return (
    <Box flex={1}>
      <ParamLabel
        label={label}
        nameFor={name}
        hint={hint}
        link={link}
        tooltip={tooltip}
      />
      <TextField
        id={name}
        inputRef={inputRef}
        fullWidth
        type={type}
        size="small"
        placeholder={searchable ? 'Search...' : 'null'}
        error={!!errors[name]}
        helperText={errors[name]?.message?.toString()}
        {...register(name)}
        {...rest}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: searchable && (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'action.active', ml: 1 }} />
            </InputAdornment>
          ),
          endAdornment: Boolean(!noClear && value) && (
            <InputAdornment position="end" sx={{ pr: 0.75 }}>
              <Tooltip title="Clear">
                <IconButton
                  tabIndex={-1}
                  onClick={handleClearClick}
                  edge="end"
                  size="small"
                  sx={{ '&:hover': { bgcolor: 'transparent' } }}
                >
                  <ClearIcon sx={{ fontSize: 18, color: 'rgb(56, 66, 72)' }} />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiInputBase-root': {
            transition: 'all 0.2s ease-in-out',
            ...(isFocused && {
              boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)'
            })
          }
        }}
      />
    </Box>
  )
}

export default ParamsField