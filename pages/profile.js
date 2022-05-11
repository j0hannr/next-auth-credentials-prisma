// import { getSession } from 'next-auth/client';
import { signIn, signOut, useSession } from "next-auth/react";
// import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserProfile from '../components/profile/user-profile';


export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  useEffect(() => {
    if (!loading && !session) {
      router.push("/");
    }
  }, [loading, session, router]);

  if (loading || status == "unauthenticated") {
    return <p />;
  }

  return <UserProfile />;

}


function ProfilePage() {
  return <UserProfile />;
}

// export async function getServerSideProps(context) {
//   const session = await getSession({ req: context.req });

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/auth',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { session },
//   };
// }

// export default ProfilePage;
