import {
  Box,
  Container,
  Typography,
  Card,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useState, useRef } from 'react';

// ----------------------------------------------------------------------

const CitiesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: 'white',
}));

const CityCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  minWidth: '380px',
  maxWidth: '380px',
  height: '600px',
  flexShrink: 0,
  position: 'relative',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[12],
  },
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(2),
}));

const CarouselWrapper = styled(Box)({
  display: 'flex',
  transition: 'transform 0.3s ease-in-out',
  gap: '16px',
  padding: '0 8px',
});

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  color: theme.palette.primary.main,
  zIndex: 2,
  boxShadow: theme.shadows[4],
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    boxShadow: theme.shadows[8],
  },
  '&.left': {
    right: theme.spacing(10),
  },
  '&.right': {
    right: theme.spacing(2),
  },
}));

const cities = [
  {
    name: 'Bedfordshire',
    image: 'https://cdn.britannica.com/46/122346-004-C4F857EF/Market-place-Ampthill-Central-Bedfordshire-England.jpg',
  },
  {
    name: 'Berkshire',
    image: 'https://cdn.britannica.com/91/116791-050-7697A7B4/Windsor-Castle-Berkshire-England.jpg',
  },
  {
    name: 'Bristol',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfAG9vfRBZ2IVFtzzp4kIFCY1Y7oG-nUbWMw&s',
  },
  {
    name: 'Buckinghamshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQutv_2rvoILwMHGnbh0SMN63cltF2mvA8h-g&s',
  },
  {
    name: 'Cambridgeshire',
    image: 'https://theswan-ely.com/wp-content/uploads/2023/09/Cambridgeshire_-The-11th-Happiest-Place-to-Live-in-England-1024x682.jpg',
  },
  {
    name: 'Cheshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiU4Ucr5tfPbmSp-rShU66WsvuB5B_GPQGlw&s',
  },
  {
    name: 'City of London',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxqWHnhum9f6m7ww7mvk-RmS63SY_-KYD8Mw&s',
  },
  {
    name: 'Cornwall',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcOrdH2ylCzkZu9wyMjojKZaVfDVBqEPOnZQ&s',
  },
  {
    name: 'County Durham',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyYrTJyOkvuRgQVfJYJ8EGTd7K_OCnIDtikw&s',
  },
  {
    name: 'Cumbria',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTua9WYKmMsZRWvXRWbXeb-8eNN5vNvticKTA&s',
  },
  {
    name: 'Derbyshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS86_jpALec788rEvrNo3DCIRwEE3yIaaT3pg&s',
  },
  {
    name: 'Devon',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnNwB10daEuh1VmQ1orsAfaCXv-W6Ikq7JIA&s',
  },
  {
    name: 'Dorset',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4c9Kb9nmEk-1TaWG-ktlgjxWrHtmzgF5PTA&s',
  },
  {
    name: 'East Riding of Yorkshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsKb19OHnGYavw9qxRKoyAswAiBf6zQ6XdxQ&s',
  },
  {
    name: 'East Sussex',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR52Pc9LAOlv-w4Rl77jGMqIRo8nlmJUAuQEA&s',
  },
  {
    name: 'Essex',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSucN3SSJnAF5QzGYftj_xLRM4Ar8CoNQkTig&s',
  },
  {
    name: 'Gloucestershire',
    image: 'https://cdn.britannica.com/53/117153-050-B465E9DE/Cheltenham-Gloucestershire-England.jpg',
  },
  {
    name: 'Greater London',
    image: 'https://media-whichmedia.s3.ap-southeast-1.amazonaws.com/media/large/3/2/32912cd0135e.jpeg',
  },
  {
    name: 'Greater Manchester',
    image: 'https://cdn.britannica.com/42/116342-050-5AC41785/Manchester-Eng.jpg',
  },
  {
    name: 'Hampshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-VeO0e4TW2GG52m4PR6sbn-roC48RQXQZ_g&s',
  },
  {
    name: 'Herefordshire',
    image: 'https://cdn.britannica.com/06/135706-050-2B32D127/River-Wye-Ross-on-Wye-England-Herefordshire.jpg',
  },
  {
    name: 'Hertfordshire',
    image: 'https://images.shiksha.com/mediadata/images/1533895092phpoIejGB.jpeg',
  },
  {
    name: 'Isle of Wight',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQt6h29JVIaUGPygdCGg-dh3Rni9gXRbBSYg&s',
  },
  {
    name: 'Kent',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1hMtIg6weMWxsIIGjkinug3EipcxyUjQMg&s',
  },
  {
    name: 'Lancashire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThEC7bIWMnPfr4Q1BakZTehLwZ2Q-7ur2yIw&s',
  },
  {
    name: 'Leicestershire',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Leicester_Clock_Tower_wide_view.jpg/330px-Leicester_Clock_Tower_wide_view.jpg',
  },
  {
    name: 'Lincolnshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgqMIx_mRYf-KmFQMM6Xtmciij9q6evKacRg&s',
  },
  {
    name: 'Merseyside',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEOX64Xsuy4OIxnx30cPlxk-4ZdBhZkVBcDw&s',
  },
  {
    name: 'Norfolk',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz5liMbVwl_IxPxbIlPQ6SWkhhrYIhCUrbgw&s',
  },
  {
    name: 'Northamptonshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvr_EMDFxEpKWbEKDipQ7Hm08gf2T-oiVCNQ&s',
  },
  {
    name: 'Northumberland',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ZiXNComy4YvnEb54XcHGjKsBb2ybZPDytw&s',
  },
  {
    name: 'North Yorkshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDoNwdbyv-cK_JrHZmPlzaMo4ASy_rkLNR_Q&s',
  },
  {
    name: 'Nottinghamshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGmyyAimn36fkhD7NoEL13Qm0O-qhz-xuW4w&s',
  },
  {
    name: 'Oxfordshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnWOgW_v-oDhhnKtsjw12z1gB8LfqG2L0Jsg&s',
  },
  {
    name: 'Rutland',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Downtown_Rutland%2C_Vermont.jpg',
  },
  {
    name: 'Shropshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWumFju_gpnjnQ1XNrK-Agb22F09f2ypNAcA&s',
  },
  {
    name: 'Somerset',
    image: 'https://cdn.britannica.com/77/148977-050-924F44D7/shopping-district-Wells-England-Somerset-centre-background.jpg',
  },
  {
    name: 'South Yorkshire',
    image: 'https://cdn.britannica.com/56/148756-050-FDEB798B/Peace-Gardens-background-town-hall-Sheffield-South.jpg',
  },
  {
    name: 'Staffordshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUJRvreYUsl41dknHHcKjNRcAs_OXO62njhA&s',
  },
  {
    name: 'Suffolk',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaAqsb1G4qI3y-w2mo7CsVgk2OZlDhec-3OQ&s',
  },
  {
    name: 'Surrey',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGkRdE03NebPTDdmfwfQrl_WR7pUthHJTXdw&s',
  },
  {
    name: 'Tyne and Wear',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrQipHrKbA7futgjqN8EJeanB-gvF8yQcfSQ&s',
  },
  {
    name: 'Warwickshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVCn2SLRbUB-bRHgtBFTIkjogbmE1rGlt_DA&s',
  },
  {
    name: 'West Midlands',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3LnDSQ43qU2lgOvne-kupmIEky5DOrz1uGQ&s',
  },
  {
    name: 'West Sussex',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNUNIUE0k9ZcSe2aQQ6SquPJfW4ys_IgNTtg&s',
  },
  {
    name: 'West Yorkshire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIOYlZlYgbo1Co1SuoAKQPDiH-9a_p4gCX9w&s',
  },
  {
    name: 'Wiltshire',
    image: 'https://cdn.britannica.com/01/76501-050-16A9EDCE/Sarsen-horseshoe-Stonehenge-III-Wiltshire-Eng.jpg',
  },
  {
    name: 'Worcestershire',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/River_Severn%2C_Central_Worcester_-_geograph.org.uk_-_3185511_%28cropped%29.jpg/330px-River_Severn%2C_Central_Worcester_-_geograph.org.uk_-_3185511_%28cropped%29.jpg',
  },
];

export default function HomePopularCities() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Calculate how many cards to show based on screen size
  const getCardsToShow = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const cardsToShow = getCardsToShow();
  const maxIndex = Math.max(0, cities.length - cardsToShow);

  const scrollToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clampedIndex);
    
    if (carouselRef.current) {
      const cardWidth = 380 + 16; // card width + gap
      const translateX = -clampedIndex * cardWidth;
      carouselRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };

  const handlePrevious = () => {
    scrollToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    scrollToIndex(currentIndex + 1);
  };

  return (
    <CitiesSection>
      <Container maxWidth="lg" sx={{ maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'start'}}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            textAlign: 'center',
            fontWeight: 900,
            mb: 6,
            color: '#1a1a1a',
            fontSize: '3rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            
          }}
        >
          Explore Popular Counties
        </Typography>
      </Box>

        <CarouselContainer>
          <CarouselWrapper ref={carouselRef}>
            {cities.map((city, index) => (
              <CityCard key={index}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${city.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1,
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      p: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '1.2px',
                        mb: 1,
                        lineHeight: 1.4,
                      }}
                    >
                      Popular County
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        color: 'white',
                        fontSize: '1.75rem',
                        fontWeight: 900,
                        lineHeight: 1.3,
                        textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {city.name}
                    </Typography>
                  </Box>
                </Box>
              </CityCard>
            ))}
          </CarouselWrapper>

          {currentIndex > 0 && (
            <NavigationButton
              className="left"
              onClick={handlePrevious}
              size="large"
            >
              <ChevronLeft />
            </NavigationButton>
          )}

          {currentIndex < maxIndex && (
            <NavigationButton
              className="right"
              onClick={handleNext}
              size="large"
            >
              <ChevronRight />
            </NavigationButton>
          )}
        </CarouselContainer>
      </Container>
    </CitiesSection>
  );
}