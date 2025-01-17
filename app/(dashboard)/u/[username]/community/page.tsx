import {format } from "date-fns";

import { getBlockedUsers } from "@/lib/block-service";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const CommunityPage = async () => {
  const blockedUsers = await getBlockedUsers();

  const formattedData = blockedUsers.map((block) => ({
    ...block,
    userId: block.blocked.id,
    image: block.blocked.image,
    username: block.blocked.username,
    createdAt: format(new Date(block.blocked.createdAt), "dd/MM/yyyy"),
  }));

  return ( 
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          Community Settings
        </h1>
      </div>
      {/* @ts-ignore */}
      <DataTable columns={columns} data={formattedData} />
    </div>
   );
}
 
export default CommunityPage;
export const dynamic = 'force-dynamic';
