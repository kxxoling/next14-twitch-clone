
import { handlers } from '@/lib/auth';

// export default NextAuth(authOptions);

// export default async function auth(req: NextApiRequest, res: NextApiResponse) {
//   // Do whatever you want here, before the request is passed down to `NextAuth`
//   return await NextAuth(req, res, authOptions);
// }
export const { GET, POST } = handlers;
