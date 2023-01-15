import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import { Web3ReactHooks } from "@web3-react/core";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { getAddChainParameters, URLS, CHAINS } from "../connectors/chains";

function ChainSelect({
                         chainId,
                         switchChain,
                         displayDefault,
                         chainIds
                     }: {
    chainId: number;
    switchChain: (chainId: number) => void | undefined;
    displayDefault: boolean;
    chainIds: number[];
}) {
    return <select value={ chainId } onChange={ (event) => {
        switchChain?.(Number(event.target.value))
    } }>
        { displayDefault && <option value="-1">Default</option> }
        { chainIds.map((chainId) => (
            <option value={ chainId } key={ chainId }>
                {
                    CHAINS[chainId]?.name ?? chainId
                }
            </option>
        )) }
    </select>
}

interface Props {
    connector: MetaMask | WalletConnect;
    chainId: ReturnType<Web3ReactHooks['useChainId']>;
    isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
    isActive: ReturnType<Web3ReactHooks['useIsActive']>;
    error: Error | undefined;
    // setError: (error: Error | undefined) => void;
    setError: Dispatch<SetStateAction<undefined>>;
}

export function ConnectWithSelect({
                                      connector,
                                      chainId,
                                      isActivating,
                                      isActive,
                                      error,
                                      setError
                                  }: Props) {
    const [desiredChainId, setDesiredChainId] = useState<number>(-1);
    const onClick = useCallback((): void => {
        setError(undefined);
        connector instanceof WalletConnect ? connector.activate(desiredChainId === -1 ? undefined : (
            desiredChainId
        )).then(() => setError(undefined)).catch(setError) : connector.activate(desiredChainId === -1 ? undefined : (
            getAddChainParameters(desiredChainId)
        )).then(() => setError(undefined)).catch(setError)
    }, [connector, desiredChainId, setError]);
    const displayDefault = false;
    const switchChain = useCallback((desiredChainId: number) => {
        if (desiredChainId === chainId) {
            setError(undefined);
            return;
        }
        if (desiredChainId === -1 && chainId === undefined) {
            setError(undefined);
            return;
        }
        connector instanceof WalletConnect ? connector.activate(desiredChainId === -1 ? undefined : (
            desiredChainId
        )).then(() => setError(undefined)).catch(setError) : connector.activate(desiredChainId === -1 ? undefined : (
            getAddChainParameters(desiredChainId)
        )).then(() => setError(undefined)).catch(setError)
    }, [chainId, connector, setError]);

    const chainIds = Object.keys(CHAINS).map(item => Number(item));

    if (error) {
        return (
            <div style={ { display: 'flex', flexDirection: 'column' } }>
                <ChainSelect chainId={ desiredChainId } switchChain={ switchChain } displayDefault={ displayDefault }
                             chainIds={ chainIds }/>
                <div style={ { marginBottom: '1rem' } }>
                    <button onClick={ onClick }>
                        Try Again?
                    </button>
                </div>
            </div>
        );
    } else if (isActive) {
        return (
            <div style={ { display: 'flex', flexDirection: 'column' } }>
                <ChainSelect chainId={ desiredChainId } switchChain={ switchChain } displayDefault={ displayDefault }
                             chainIds={ chainIds }/>
                <div style={ { marginBottom: '1rem' } }>
                    <button onClick={ () => {
                        if (connector?.deactivate) {
                            void connector.deactivate();
                        } else {
                            connector.resetState();
                        }
                    } }>
                        Disconnect
                    </button>
                </div>
            </div>
        )
    } else {
        return (
            <div style={ { display: 'flex', flexDirection: 'column' } }>
                <ChainSelect chainId={ desiredChainId } switchChain={ switchChain } displayDefault={ displayDefault }
                             chainIds={ chainIds }/>
                <div style={ { marginBottom: '1rem' } }>
                    <button onClick={
                        isActivating ? undefined : () => {
                            // connector.activate(desiredChainId === -1 ? undefined : (
                            //     connector instanceof WalletConnect ? desiredChainId : getAddChainParameters(desiredChainId)
                            // )).then(() => setError(undefined)).catch(setError)
                            connector instanceof WalletConnect ? connector.activate(desiredChainId === -1 ? undefined : (
                                desiredChainId
                            )).then(() => setError(undefined)).catch(setError) : connector.activate(desiredChainId === -1 ? undefined : (
                                getAddChainParameters(desiredChainId)
                            )).then(() => setError(undefined)).catch(setError)
                        }
                    }>
                        Connect
                    </button>
                </div>
            </div>
        );
    }
}
