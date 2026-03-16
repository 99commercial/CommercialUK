import { ReactNode } from 'react';
// guards
// components
import MainLayout from './Main/MainLayout';
import { useRouter } from 'next/router';
import AgentLayout from './Agent/AgentLayout';
import UserLayout from './User/UserLayout';
import AdminLayout from './Admin/AdminLayout';
import LivePageChatWidget from '../components/LivePageChatWidget';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const router = useRouter();

  let query = router.asPath;
  const pathname = router.pathname;

  let queryArray = query.split('/');

  // Check if it's the index (coming soon) page - return children without any layout (no navbar)
  if (pathname === '/') {
    return (
      <>
        {children}
        <LivePageChatWidget />
      </>
    );
  }

  // Check if it's a report page - return children without any layout (no navbar)
  if (queryArray.includes('report')) {
    return (
      <>
        {children}
        <LivePageChatWidget />
      </>
    );
  }

  if (queryArray.includes('agent')) {
    return (
      <>
        <AgentLayout>{children}</AgentLayout>
        <LivePageChatWidget />
      </>
    );
  } else if (queryArray.includes('user')) {
    return (
      <>
        <UserLayout>{children}</UserLayout>
        <LivePageChatWidget />
      </>
    );
  } else if (queryArray.includes('admin')) {
    return (
      <>
        <AdminLayout>{children}</AdminLayout>
        <LivePageChatWidget />
      </>
    );
  } else {
    return (
      <>
        <MainLayout>{children}</MainLayout>
        <LivePageChatWidget />
      </>
    );
  }
}
