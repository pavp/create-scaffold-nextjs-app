import { PropsWithChildren } from 'react';

import { AuthProvider } from '@/core/components';

export default function HomeLayout(props: PropsWithChildren) {
  return <AuthProvider>{props.children}</AuthProvider>;
}
