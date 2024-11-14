import SkeletonFullPage from '@/app/(easycob)/components/SkeletonFullPage';
import React, { Suspense } from 'react'
import { fetchUserAndTypes } from '../service/actions';
import { redirect } from 'next/navigation';
import ContainerTypes from './components/ContainerTypes';

export default async function Type() {
    try {
        const usersAndTypes = await fetchUserAndTypes();
    
        return (
          <Suspense fallback={<SkeletonFullPage />}>
            <ContainerTypes usersAndTypes={usersAndTypes}/>
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