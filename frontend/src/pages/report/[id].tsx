import React from 'react';
import Head from 'next/head';
import ReportDetailedPage from '../../sections/report/detailedPage';

// ----------------------------------------------------------------------

const ReportDetailPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Property Report | CommercialUK</title>
        <meta name="description" content="View detailed property report" />
      </Head>
      <ReportDetailedPage />
    </>
  );
};

export default ReportDetailPage;

