import { SessionProvider } from "next-auth/react";
import { Navigation } from "./navigation";
import { Toggle } from "./toggle";
import { Wrapper } from "./wrapper";
import { auth } from "@/lib/auth";

export const Sidebar = async () => {
  // const { data: session, status } = useSession()
  // console.log('Sidebar', useSession, SessionProvider)
  const session = await auth()
  return (
    <Wrapper>
      <Toggle />
      <SessionProvider session={session}>
        <Navigation />
      </SessionProvider>
    </Wrapper>
  );
};
