import { api } from "~/trpc/server";
import { ProfileCard } from "./_components/ProfileCard";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center bg-amber-200">
      {/* <ProfileForm/> */}
      <div></div>
      <ProfileCard></ProfileCard>
    </main>
  );
}