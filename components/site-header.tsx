import { getServerSession } from "next-auth/next"
import { HeaderV2 } from "@/components/header-v2"

export async function SiteHeader() {
  return <HeaderV2 />
}
