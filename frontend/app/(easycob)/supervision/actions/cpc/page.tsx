import SkeletonFullPage from '@/app/(easycob)/components/SkeletonFullPage';
import React, { Suspense } from 'react'
import { fetchUserAndCpc } from '../service/actions';
import { redirect } from 'next/navigation';
import ContainerCpc from './components/ContainerCpc';

export default async function Cpc() {
    try {
        const usersAndCpc = await fetchUserAndCpc();
    
        return (
          <Suspense fallback={<SkeletonFullPage />}>
            <ContainerCpc usersAndCpc={usersAndCpc}/>
          </Suspense>
        );
      } catch (error) {
        if (error instanceof Error) {
          if (error.message == "Unauthorized") {
            redirect("/logout");
          }
        }
      }
}
//fetchUserAndTypes