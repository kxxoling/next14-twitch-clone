import { auth } from '@/lib/auth';

import { StreamPlayer } from "@/components/stream-player";
import { getUserByUsername } from "@/lib/user-service";
import { Button } from "@/components/ui/button";
import { addUserStream } from '@/lib/stream-service';

interface CreatorPageProps {
  params: {
    username: string;
  };
};

async function addStream() {
  'use server'

  const session = await auth()
  const self = session?.user;
  const stream = await addUserStream(self!.id, 'new stream');
  return stream;
}

const CreatorPage = async ({
  params,
}: CreatorPageProps) => {
  const session = await auth()
  const self = session?.user;
  const user = await getUserByUsername(params.username);

  if (!user || user.id !== self?.id) {
    throw new Error("Unauthorized");
  }

  if (!user.stream) {
    return <div>
      <p className="text-xl font-bold">You have not started a stream yet</p>
      <p className="text-lg">Click the button below to start streaming</p>
      <form action={addStream}>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Start Stream
        </Button>
      </form>
    </div>
  }

  return (
    <div className="h-full">
      <StreamPlayer
        user={user!}
        stream={user.stream}
        isFollowing
      />
    </div>
  );
}

export default CreatorPage;
