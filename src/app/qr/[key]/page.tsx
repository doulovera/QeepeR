import { List } from "@/components/qr-list/list";

export default function UserQrList({ params }: { params: { key: string } }) {

  return (
    <main className="flex flex-col items-center justify-center min-h-screen my-10">
      <List id={params.key} />
    </main>
  );
}
