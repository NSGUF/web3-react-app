import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from "@web3-react/walletconnect";
import { getName } from "../connectors/utils";
import { Web3ReactHooks } from "@web3-react/core";
import { Status } from "./Status";
import { Accounts } from "./Accounts";
import { Dispatch, SetStateAction } from "react";
import { ConnectWithSelect } from "./ConnectWithSelect";

interface Props {
    connector: MetaMask | WalletConnect;
    chainId: ReturnType<Web3ReactHooks['useChainId']>;
    isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
    isActive: ReturnType<Web3ReactHooks['useIsActive']>;
    error: Error | undefined;
    ENSNames: ReturnType<Web3ReactHooks['useENSNames']>;
    provider?: ReturnType<Web3ReactHooks['useProvider']>;
    accounts?: string[];
    // setError: (error: Error | undefined) => void;
    setError: Dispatch<SetStateAction<undefined>>;
}

export function Card({
                         connector,
                         chainId,
                         isActivating,
                         isActive,
                         error,
                         ENSNames,
                         provider,
                         accounts,
                         setError
                     }: Props) {
    return (
        <div style={ {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '40rem',
            padding: '1rem',
            margin: '1rem',
            overflow: 'auto',
            border: '1px solid',
            borderRadius: '1rem',
        } }>
            <b>{ getName(connector) }</b>
            <div style={ { marginBottom: '1rem∂' } }>
                <Status isActivating={ isActivating } isActive={ isActive } error={ error }/>
            </div>
            <div style={ { marginBottom: '1rem∂' } }>
                <Accounts accounts={ accounts } provider={ provider } ENSNames={ ENSNames }/>
            </div>
            <div style={ { marginBottom: '1rem∂' } }>
                <ConnectWithSelect connector={ connector } chainId={ chainId } isActivating={ isActivating }
                                   isActive={ isActive } error={ error } setError={ setError }/>
            </div>
        </div>
    );
}
