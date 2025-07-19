import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {}

const LandingPageNavBar = (props: Props) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="text-3xl font-semibold flex items-center gap-x-3">
        <Menu
          className="w-8 h-8"
        />
        <Image
          src="/opal-logo.png"
          alt="Opal"
          width={40}
          height={40}
        />
        Opal
      </div>
      <div className="hidden gap-x-10 items-center lg:flex">
        <Link href="/" className="bg-[#7320DD] hover:bg-[#7320DD]/80 text-lg text-white px-5 py-2 font-semibold rounded-full">
          Home
        </Link>
        <Link href="/" className="hover:text-[#7320DD]">
          Pricing
        </Link>
        <Link href="/">Contact</Link>
      </div>
      <div className="flex items-center gap-x-2">
        <Link href="/auth/sign-in">
          <Button variant="outline" className="text-base flex gap-x-2">
            Login
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default LandingPageNavBar;