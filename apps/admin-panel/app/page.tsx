import UserTable from "@/components/UserTable";
import Image from "next/image";

export default function Home() {
  return (
   <div className="bg-background text-foreground">
    <UserTable/>
   </div>
  );
}
