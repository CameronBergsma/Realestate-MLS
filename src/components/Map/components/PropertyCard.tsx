import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined'
import BedOutlinedIcon from '@mui/icons-material/BedOutlined'
import HomeIcon from '@mui/icons-material/Home'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Box, Stack, Typography } from '@mui/material'

import { type Listing } from 'services/API/types'
import { formatEnglishPrice } from 'utils/formatters'

import { getCDNPath } from './CardsCarousel'

const defaultPrice = '$,$$$,$$$'

const PropertyCard = ({
  listing,
  onClick
}: {
  listing: Listing
  onClick?: (mlsNumber: string, boardId: number) => void
}) => {
  const {
    address,
    class: propertyClass,
    listPrice = defaultPrice,
    details: { numBathrooms = '?', numBedrooms = '?', propertyType = '?', sqft = '?' } = {}
  } = listing

  const commercial = propertyClass === 'CommercialProperty'

  const locationString =
    address && address?.city
      ? [address?.neighborhood, address?.city, address?.zip]
          .filter(Boolean)
          .join(', ')
      : ''

  const addressString = address
    ? [
        address.streetNumber,
        address.streetName,
        address.streetSuffix,
        locationString
      ]
        .filter(Boolean)
        .join(' ')
    : 'No address'

  const handleClick = () => {
    onClick?.(listing.mlsNumber, listing.boardId)
  }

  return (
    <Stack
      id={`card-${listing.mlsNumber}`}
      direction="row"
      spacing={1}
      sx={{
        flex: '0 0 auto',
        p: 1,
        mr: 2,
        '&:last-child': { mr: 0 },
        width: 280,
        boxShadow: 1,
        borderRadius: 1,
        cursor: 'pointer',
        bgcolor: '#FFFE',
        border: '1px solid transparent',
        backdropFilter: 'blur(4px)'
      }}
      onClick={handleClick}
    >
      <Box
        sx={{
          height: 120,
          width: 160,
          minWidth: 160,
          borderRadius: 0.75,
          bgcolor: '#384248',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(${getCDNPath(listing.images?.[0], 'small')})`
        }}
      />
      <Stack
        sx={{
          fontSize: '10pt',
          lineHeight: 1.25,
          overflow: 'hidden',
          flex: 1
        }}
        justifyContent="space-between"
      >
        <Stack spacing={1}>
          <Typography variant="h6" fontSize={16} fontWeight="bold">
            {listPrice !== defaultPrice
              ? formatEnglishPrice(listPrice)
              : defaultPrice}
          </Typography>
          
          <Stack direction="row" spacing={0.5} alignItems="center">
            <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {addressString}
            </Typography>
          </Stack>

          {commercial ? (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <HomeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2">{propertyType}</Typography>
            </Stack>
          ) : (
            <>
              <Stack direction="row" spacing={2}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <BedOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2">{numBedrooms}</Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <BathtubOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="body2">{numBathrooms}</Typography>
                </Stack>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {sqft} sqft
              </Typography>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}

export default PropertyCard