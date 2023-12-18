/* eslint-disable react/no-unescaped-entities */
import { auth, signIn, signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { FormTabs } from '../_components/form';

export function SignIn({
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server"
        await signIn()
      }}
    >
      <Button {...props}>Sign In</Button>
    </form>
  )
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
      className="w-full"
    >
      <Button variant="ghost" className="w-full p-0" {...props}>
        Sign Out
      </Button>
    </form>
  )
}

export default async function Page() {
  const session = await auth()
  const isLoggedIn = !!session?.user
  return <div>
    <FormTabs />
    {
      isLoggedIn && (
        <div>
          <p>
            You've signed in. Username: {session?.user?.username}
          </p>
          <SignOut />
        </div>
      ) 
    }
  </div>
}
