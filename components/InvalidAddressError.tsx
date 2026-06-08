import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface InvalidAddressErrorProps {
  address: string;
  errorMessage: string;
}

export function InvalidAddressError({ address, errorMessage }: InvalidAddressErrorProps) {
  const truncatedAddress = address.length > 20
    ? `${address.slice(0, 10)}...${address.slice(-10)}`
    : address;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="animate-subtle-pulse mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 sm:mb-6 sm:h-16 sm:w-16">
          <AlertCircle className="h-7 w-7 text-destructive sm:h-8 sm:w-8" />
        </div>

        <h1 className="mb-2 text-xl font-bold sm:text-2xl">Invalid Address</h1>

        <p className="mb-4 text-sm text-muted-foreground sm:text-base">
          The address you entered is not a valid Solana wallet address.
        </p>

        <div className="mb-4 w-full rounded-lg bg-muted/50 px-3 py-2 sm:px-4">
          <code className="break-all font-mono text-xs sm:text-sm">{truncatedAddress}</code>
        </div>

        <p className="mb-6 text-xs text-destructive sm:text-sm">{errorMessage}</p>

        <Link href="/" className={buttonVariants({ className: "h-11 px-6 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 sm:h-10" })}>
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Search
        </Link>
      </div>
    </div>
  );
}
