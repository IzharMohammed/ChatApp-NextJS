import { db } from "@/lib/db";

export default function Home() {
  db.set('izhar','successful')
  return (
    <>
      WELCOME
    </>
  );
}
