import {
  createWalletClient,
  WalletClient,
  type Account,
  http,
  parseEther,
  erc20Abi,
  createPublicClient,
  formatUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const USDC_CONTRACT_ADDRESS = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";

export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

class WalletService {
  private account: Account;
  private walletClient: WalletClient;

  constructor() {
    const privateKey = Bun.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("PRIVATE_KEY is not set");
    }
    const formattedPrivateKey = privateKey.startsWith("0x")
      ? privateKey
      : `0x${privateKey}`;
    if (!/^0x[a-fA-F0-9]{64}$/.test(formattedPrivateKey)) {
      throw new Error(
        "INFLECTION_PRIVATE_KEY must be a valid 64-character hex string (with or without 0x prefix)"
      );
    }
    this.account = privateKeyToAccount(formattedPrivateKey as `0x${string}`);

    this.walletClient = createWalletClient({
      account: this.account,
      chain: base,
      transport: http(),
    });
  }

  public async transferUSDC(to: string, amount: string) {
    const hash = await this.walletClient.writeContract({
      address: USDC_CONTRACT_ADDRESS,
      abi: erc20Abi,
      functionName: "transfer",
      args: [to as `0x${string}`, parseEther(amount)],
      account: this.account,
      chain: base,
    });
    return hash;
  }

  public async getWalletBalance() {
    const balance = await publicClient.readContract({
      address: USDC_CONTRACT_ADDRESS,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [this.account.address],
    });
    return formatUnits(balance, 6);
  }
}


export const walletService = new WalletService()
