'use server'

import { List } from "@/components/qr-list/list";

export default async function UserQrList({ params }: { params: { key: string } }) {

  return (
    <main className="flex flex-col items-center justify-center min-h-screen my-10">
      <List />
    </main>
  );
}
