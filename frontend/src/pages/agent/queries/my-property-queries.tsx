import React from 'react';
import { MyPropertyQueries, QueryData } from '../../../sections/user/queries';
import HeaderCard from '../../../components/HeaderCard';

const MyPropertyQueriesPage: React.FC = () => {
  const handleQueryClick = (query: QueryData) => {
    console.log('Query clicked:', query);
    // Handle query click - can be used to show details, navigate, etc.
  };

  return (
    <>
      <HeaderCard title="My Property Queries" breadcrumbs={['Dashboard', 'Queries', 'My Property Queries']} />
      <MyPropertyQueries
      />
    </>
  );
};

export default MyPropertyQueriesPage;
