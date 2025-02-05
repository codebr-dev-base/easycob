import SkeletonFullPage from '@/app/(easycob)/components/SkeletonFullPage';
import React, { Suspense } from 'react'
import { fetchUserAndChannel } from '../service/actions';
import { redirect } from 'next/navigation';
import ContainerCpc from './components/ContainerChannel';

export default async function Cpc() {
    try {
        const usersAndChannel = await fetchUserAndChannel();
    
        return (
          <Suspense fallback={<SkeletonFullPage />}>
            <ContainerCpc usersAndChannel={usersAndChannel}/>
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