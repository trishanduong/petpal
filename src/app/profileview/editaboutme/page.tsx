
'use client'

import { api } from '~/trpc/react';
import ProfileCard from '~/app/_components/ProfileCard';
import EditTraitsForm from '~/app/_components/editform/editTraitForm';
import EditContents from '~/app/_components/editform/EditContents';
import LoadingModal from '~/app/_components/LoadingModal';

export default function EditProfile(){
  const {data: profile, isLoading, error} = api.profile.getProfileById.useQuery({type: 'personal'});

  if(isLoading) return <LoadingModal />;
  if (error) return <div>An error occurred: {error.message}</div>;
  const userId = profile?.userId;
  if (!userId) {
    return <div>User not authenticated</div>;
 }

  const {traitsId} = profile;
  if(!traitsId) throw new Error("Query error: No traits ID");

    return (
        <div>
        <EditContents/>
        <div className='flex flex-col md:flex-row justify-around mt-2 pt-15 px-4 '>
            <div className="w-full flex flex-col md:w-4/6 bg-yellow-500 p-3 rounded-lg">
                <EditTraitsForm traitsId={traitsId}/>
            </div>
            <div className="w-full md:w-auto md:flex-none md:ml-4 ">
                {!isLoading && <ProfileCard {...profile}/>}
            </div>
        </div>
      </div>
      )
}