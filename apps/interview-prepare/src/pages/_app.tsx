import '@/assets/main.css';
import { RecoilRoot } from 'recoil';
import { PageLayout } from 'ui/Layout';

import { Head, ModalCtrl } from '@/frontend/components/common';

import type { AppProps } from 'next/app';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Head />
      <RecoilRoot>
        <PageLayout>
          <Component {...pageProps} />
          <ModalCtrl />
        </PageLayout>
      </RecoilRoot>
    </>
  );
}
