import { initializeConnector } from "@web3-react/core";
import { WalletConnect } from "@web3-react/walletconnect";
import { URLS } from "./chains";

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
    // 状态管理器
    (actions) =>
        // 钱包相关操作的 WalletConnect
        new WalletConnect({
            actions, options: {
                rpc: URLS
            }
        })
);

// hooks分配文件
// walletconnet
// actions 暴露actions
// 管理状态
