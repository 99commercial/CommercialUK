// @mui
import { styled } from '@mui/material/styles';

// layouts
import MainLayout from '../layouts/Main/MainLayout';

// components
import Page from '../components/Page';

// sections
import {
  HomeHero,
  HomeTrustMetrics,
  HomeAuction,
  HomePopularCities,
  HomeBenefits,
  HomeTrustedBusinesses,
  HomeFAQ,
  HomeFooter,
} from '../sections/home';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

LivePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

// ----------------------------------------------------------------------

export default function LivePage() {
  return (
    <Page title="The World's #1 Commercial Real Estate Marketplace">
      <HomeHero />
      <ContentStyle>
        <HomeTrustMetrics />
        <HomeAuction />
        <HomePopularCities />
        <HomeBenefits />
        <HomeTrustedBusinesses />
        <HomeFAQ />
        <HomeFooter />
      </ContentStyle>
    </Page>
  );
}
