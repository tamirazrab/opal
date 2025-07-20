import { ReactNode } from "react";
import LandingPageNavBar from "./_components/navbar";

type Props = {
  children: ReactNode;
}

export default function WebsiteLayout({ children }: Props) {
  return (
    <div className="flex flex-col py-10 px-10 xl:px-0 container">
      <LandingPageNavBar />
        {children}
    </div>
  )
}