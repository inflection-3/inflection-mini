"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Copy,
  QrCode,
  ArrowUpRight,
  Wallet,
  Zap,
} from "lucide-react";

export function WalletScreen({
  isOpen,
  setIsOpen,
  tab,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  tab: "deposit" | "send";
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-3 md:p-8 max-w-sm w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Wallet className="h-5 w-5" />
            USDC Smart Wallet
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-1">
              <Zap className="h-3 w-3" />
              Gas Sponsored
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {tab === "deposit" && (
            <div className="flex flex-col gap-y-4">
            
              <CardContent className="space-y-4 px-0">
                <div className="flex items-center space-x-2">
                  <Input
                    value="0x..."
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-center p-4 border border-dashed rounded-lg">
                  <div className="text-center space-y-2">
                    <QrCode className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      QR Code (Coming Soon)
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    ⚡ <strong>Gas Sponsored:</strong> Receiving USDC is free -
                    no gas fees required!
                  </p>
                </div>
              </CardContent>
            </div>
          )}
          {tab === "send" && (
            <div className="flex flex-col gap-y-4">
              <CardHeader className="px-0">
                <CardDescription className="px-0">
                  Transfer USDC to another address on Base Mainnet{" "}
                  <a
                    href="https://app.p2p.lol/campaign?id=9&manager=inflection"
                    target="_blank"
                    className="underline"
                  >
                    create p2p.me wallet
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-0">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USDC)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="px-4"
                    >
                      Max
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available: 0.00 USDC
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ⚡ <strong>Gas Sponsored:</strong> This transaction is free
                    - no gas fees!
                  </p>
                </div>

                <Button
                  className="w-full gap-2"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Send USDC
                </Button>
              </CardContent>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}