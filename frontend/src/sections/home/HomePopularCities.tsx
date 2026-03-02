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
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/aa/8c/67/wrest-park.jpg?w=1200&h=-1&s=1',
  },
  {
    name: 'Berkshire',
    image: 'https://cdn.britannica.com/91/116791-050-7697A7B4/Windsor-Castle-Berkshire-England.jpg',
  },
  {
    name: 'Bristol',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Clifton_Suspension_Bridge_and_the_Observatory_in_Bristol%2C_England.jpg',
  },
  {
    name: 'Buckinghamshire',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/17/21/ec/photo2jpg.jpg?w=1200&h=-1&s=1',
  },
  {
    name: 'Cambridgeshire',
    image: 'https://theswan-ely.com/wp-content/uploads/2023/09/Cambridgeshire_-The-11th-Happiest-Place-to-Live-in-England-1024x682.jpg',
  },
  {
    name: 'Cheshire',
    image: 'https://dc-cheshire.transforms.svdcdn.com/production/misc/pages-heros/Audlem.jpg?w=768&h=768&q=90&auto=format&fit=crop&dm=1741269834&s=b17393624293749e4949c4a7290c71e0',
  },
  {
    name: 'City of London',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/City_of_London%2C_seen_from_Tower_Bridge.jpg/1280px-City_of_London%2C_seen_from_Tower_Bridge.jpg',
  },
  {
    name: 'Cornwall',
    image: 'https://www.cornwallhideaways.co.uk/images/cornwall/guide/cornwall-town-guide-the-best-5-towns-in-cornwall_1.jpg?1768694400078',
  },
  {
    name: 'County Durham',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Durham_MMB_02_Cathedral.jpg',
  },
  {
    name: 'Cumbria',
    image: 'https://thehistorypress.co.uk/wp-content/uploads/media/4762/glenridding-_cumbria-_england_-_june_2009-wpv_1020x800_center_center.jpg',
  },
  {
    name: 'Derbyshire',
    image: 'https://darwinforest.co.uk/files/img_cache/1004/770_500_1_1632322331_bamfordls.jpg?1632323772',
  },
  {
    name: 'Devon',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/74/b5/e6/caption.jpg?w=1400&h=1400&s=1',
  },
  {
    name: 'Dorset',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Durdle_Door_Overview.jpg/1280px-Durdle_Door_Overview.jpg',
  },
  {
    name: 'East Riding of Yorkshire',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flamborough_Head_-_geograph.org.uk_-_4010883_%28cropped%29.jpg',
  },
  {
    name: 'East Sussex',
    image: 'https://static.independent.co.uk/2024/10/24/08/newFile-1.jpg',
  },
  {
    name: 'Essex',
    image: 'https://a0.muscache.com/im/pictures/INTERNAL/INTERNAL-ImageByPlaceId-ChIJ0w2H_idW2EcReVDuRzjLV0I-large_background/original/983247d8-450c-4b45-ad80-47b01fe568c0.jpeg',
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
    image: 'https://cdn.britannica.com/96/123396-050-057F981F/Beaulieu-Palace-House-Hampshire-Eng.jpg',
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
    image: 'https://www.doctorsrelocate.com/wp-content/uploads/2023/07/Isle-of-Wight.jpeg',
  },
  {
    name: 'Kent',
    image: 'https://cdn.sanity.io/images/nxpteyfv/goguides/8b60cffe22a53481f7ffeddeddfa65edcfb401c0-1600x1066.jpg',
  },
  {
    name: 'Lancashire',
    image: 'https://i2-prod.lancs.live/article33203686.ece/ALTERNATES/s1200b/0_JMP_MEN_040423NEWTONINBOWLAND_25JPG.jpg',
  },
  {
    name: 'Leicestershire',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-0iquXs6A6UbwNdPjJrO-tX5DHGt-WhxtvA&s',
  },
  {
    name: 'Lincolnshire',
    image: 'https://www.visitlincolnshire.com/wp-content/uploads/2021/03/visit-lincolnshire-home-feature.jpg',
  },
  {
    name: 'Merseyside',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Pier_Head%2C_Liverpool_-_geograph.org.uk_-_3059094.jpg',
  },
  {
    name: 'Norfolk',
    image: 'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,q_75,w_1200/v1/crm/virginia/Norfolk-skyline_76A27A7F-DE17-4A09-8F6EB20B6A7072F4_e44f9e5e-312b-439a-b267962dbc536bf1.jpg',
  },
  {
    name: 'Northamptonshire',
    image: 'https://www.telegraph.co.uk/content/dam/Travel/2020/September/Oundle-in-Northamptonshire-iStock-1070591478.jpg?imwidth=640',
  },
  {
    name: 'Northumberland',
    image: 'https://www.visitnorthumberland.com/media/rykbdu35/historic-sites-hero-credit-ournorthumberland.jpg?width=1920&height=1080&v=1db7c093f9a7a80',
  },
  {
    name: 'North Yorkshire',
    image: 'https://cdn.britannica.com/29/100429-050-3F009E18/England-North-Yorkshire-Whitby.jpg',
  },
  {
    name: 'Nottinghamshire',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Nottingham_Council_House_-_geograph.org.uk_-_2943238_%28cropped%29.jpg/250px-Nottingham_Council_House_-_geograph.org.uk_-_2943238_%28cropped%29.jpg',
  },
  {
    name: 'Oxfordshire',
    image: 'https://www.discoverbritain.com/_gatsby/file/f0ba492337deb89649d6a9851f307ed8/25834_Blenheim-Water-Terraces.jpg',
  },
  {
    name: 'Rutland',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Downtown_Rutland%2C_Vermont.jpg',
  },
  {
    name: 'Shropshire',
    image: 'https://www.shropshire-guide.co.uk/wp-content/uploads/2020/06/bridgnorth-v296-4-DSC_5757-1.jpg',
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Staffordshire_Shire_Hall.jpg',
  },
  {
    name: 'Suffolk',
    image: 'https://cdn.sanity.io/images/nxpteyfv/goguides/47c9c5c9c36233d8d79b7f01c0011aaa09262b35-1600x1066.jpg',
  },
  {
    name: 'Surrey',
    image: 'https://assets.simpleviewinc.com/simpleview/image/fetch/c_fill,f_jpg,h_822,q_75,w_1220/https://tsedmsmedia.newmindmedia.com/wsimgs/Visit_Surrey_Lion_Lamb_Yard_Farnham_April_2017_2034495497.jpg',
  },
  {
    name: 'Tyne and Wear',
    image: 'https://northeastbylines.co.uk/wp-content/uploads/2023/04/Tyne-Bridge.jpg',
  },
  {
    name: 'Warwickshire',
    image: 'https://cdn.britannica.com/96/114496-050-23A2686E/Castle-Warwick-River-Avon-England-Warwickshire.jpg',
  },
  {
    name: 'West Midlands',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Dudley_Castle_-_panoramio_-_Tanya_Dedyukhina_%282%29.jpg',
  },
  {
    name: 'West Sussex',
    image: 'https://cdn.britannica.com/48/149148-050-A08B6FA0/chalk-cliffs-Seven-Sisters-cottages-South-Downs.jpg',
  },
  {
    name: 'West Yorkshire',
    image: 'https://cdn.britannica.com/50/116150-050-70CF1DDB/Todmorden-West-Yorkshire-Eng.jpg',
  },
  {
    name: 'Wiltshire',
    image: 'https://www.discoverbritain.com/_gatsby/file/a076e4dcc2d89d13ca37f996aeddaaf8/51432_FCR-496943-683x1024.jpg',
  },
  {
    name: 'Worcestershire',
    image: 'https://cdn.britannica.com/50/149250-050-9F3B7288/Barge-lock-Worcestershire-Canal-Staffordshire-St-Mary.jpg',
  },
];

// const cities = [
//   {
//     name: 'Bedfordshire',
//     image: 'https://images.pexels.com/photos/18251214/pexels-photo-18251214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Berkshire',
//     image: 'https://images.pexels.com/photos/10363291/pexels-photo-10363291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Bristol',
//     image: 'https://images.pexels.com/photos/3389531/pexels-photo-3389531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Buckinghamshire',
//     image: 'https://images.pexels.com/photos/15745266/pexels-photo-15745266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Cambridgeshire',
//     image: 'https://images.pexels.com/photos/1119702/pexels-photo-1119702.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Cheshire',
//     image: 'https://images.pexels.com/photos/10852654/pexels-photo-10852654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'City of London',
//     image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Cornwall',
//     image: 'https://images.pexels.com/photos/3061345/pexels-photo-3061345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'County Durham',
//     image: 'https://images.pexels.com/photos/15745281/pexels-photo-15745281.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Cumbria',
//     image: 'https://images.pexels.com/photos/2723380/pexels-photo-2723380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Derbyshire',
//     image: 'https://images.pexels.com/photos/3551221/pexels-photo-3551221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Devon',
//     image: 'https://images.pexels.com/photos/1018512/pexels-photo-1018512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Dorset',
//     image: 'https://images.pexels.com/photos/386001/pexels-photo-386001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'East Riding of Yorkshire',
//     image: 'https://images.pexels.com/photos/11545695/pexels-photo-11545695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'East Sussex',
//     image: 'https://images.pexels.com/photos/3389536/pexels-photo-3389536.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Essex',
//     image: 'https://images.pexels.com/photos/6604294/pexels-photo-6604294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Gloucestershire',
//     image: 'https://images.pexels.com/photos/13511197/pexels-photo-13511197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Greater Manchester',
//     image: 'https://images.pexels.com/photos/2042161/pexels-photo-2042161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Hampshire',
//     image: 'https://images.pexels.com/photos/2676839/pexels-photo-2676839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Kent',
//     image: 'https://images.pexels.com/photos/2143419/pexels-photo-2143419.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Lancashire',
//     image: 'https://images.pexels.com/photos/17926135/pexels-photo-17926135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Merseyside',
//     image: 'https://images.pexels.com/photos/4006509/pexels-photo-4006509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Norfolk',
//     image: 'https://images.pexels.com/photos/12316641/pexels-photo-12316641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'North Yorkshire',
//     image: 'https://images.pexels.com/photos/2673994/pexels-photo-2673994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Oxfordshire',
//     image: 'https://images.pexels.com/photos/258109/pexels-photo-258109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Surrey',
//     image: 'https://images.pexels.com/photos/18251205/pexels-photo-18251205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   },
//   {
//     name: 'Warwickshire',
//     image: 'https://images.pexels.com/photos/161947/warwick-castle-tower-england-castle-161947.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   }
// ];

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