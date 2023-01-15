import { useEffect, useState } from "react";
import type { BigNumber } from "@ethersproject/bignumber";
import { Web3ReactHooks } from "@web3-react/core";
import { formatEther } from "@ethersproject/units";

function useBalances(provider?: ReturnType<Web3ReactHooks['useProvider']>, accounts?: string[]) {
    const [balances, setBalances] = useState<BigNumber[] | undefined>();

    useEffect(() => {
        if (provider && accounts?.length) {
            let stale = false;
            void Promise.all(
                accounts.map(account => provider.getBalance(account))
            ).then((balances) => {
                if (stale) return;
                setBalances(balances);
            })
            return () => {
                stale = true;
                setBalances(undefined);
            }
        }
    }, [accounts, provider]);

    return balances;
}

export function Accounts({
                             accounts,
                             provider,
                             ENSNames,
                         }: {
    accounts: ReturnType<Web3ReactHooks['useAccounts']>,
    provider: ReturnType<Web3ReactHooks['useProvider']>,
    ENSNames: ReturnType<Web3ReactHooks['useENSNames']>,
}) {
    const balances = useBalances(provider, accounts);
    if (accounts === undefined) return <div>accounts is undefined</div>

    return (
        <div>
            Accounts:{ ' ' }
            <b>
                {
                    accounts.length === 0 ? 'None' : accounts.map((account, i) => (
                        <ul key={ account } /*style={ { margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' } }*/>
                            { ENSNames?.[i] ?? account }
                            { balances?.[i] ? `(${ formatEther(balances[i]) })` : null }
                        </ul>
                    ))
                }
            </b>
        </div>
    );
}
