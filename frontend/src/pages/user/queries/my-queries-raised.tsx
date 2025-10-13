import React from 'react';
import { MyQueriesRaised, MyQueryData } from '../../../sections/user/queries';
import HeaderCard from '../../../components/HeaderCard';

const MyQueriesRaisedPage: React.FC = () => {
  console.log('MyQueriesRaisedPage component rendered');
  
  const handleQueryClick = (query: MyQueryData) => {
    console.log('Query clicked:', query);
    // Handle query click - can be used to show details, navigate, etc.
  };

  return (
    <>
      <HeaderCard title="My Queries Raised" breadcrumbs={['Dashboard', 'Queries', 'My Queries Raised']} />
      <MyQueriesRaised
        onQueryClick={handleQueryClick}
      />
    </>
  );
};

export default MyQueriesRaisedPage;
