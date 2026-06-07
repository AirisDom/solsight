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
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="mb-2 text-2xl font-bold">Invalid Address</h1>

        <p className="mb-4 text-muted-foreground">
          The address you entered is not a valid Solana wallet address.
        </p>

        <div className="mb-4 rounded-lg bg-muted/50 px-4 py-2">
          <code className="text-sm font-mono break-all">{truncatedAddress}</code>
        </div>

        <p className="mb-6 text-sm text-destructive">{errorMessage}</p>

        <Link href="/" className={buttonVariants()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Link>
      </div>
    </div>
  );
}
