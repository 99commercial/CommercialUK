import { ReactNode } from 'react';
// guards
// components
import MainLayout from './Main/MainLayout';
import { useRouter } from 'next/router';
import AgentLayout from './Agent/AgentLayout';
import UserLayout from './User/UserLayout';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const router = useRouter();

  let query = router.asPath;

  let queryArray = query.split('/');

  if (queryArray.includes('agent')) {
    return <AgentLayout>{children}</AgentLayout>;
  } else if(queryArray.includes('user')) {
    return <UserLayout>{children}</UserLayout>;
  } else {
    return <MainLayout>{children}</MainLayout>;
  }

  return (
    <>
    {children}
    </>
  );
}
