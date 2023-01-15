import { hooks, metaMask } from "../../connectors/metaMask";
import { useEffect, useState } from "react";
import { Card } from "../Card";

const {
    useChainId,
    useAccounts,
    useIsActivating,
    useIsActive,
    useProvider,
    useENSNames,
} = hooks;

export default function MetaMaskCard() {
    const chainId = useChainId();
    const accounts = useAccounts();
    const isActivating = useIsActivating();
    const isActive = useIsActive();
    const provider = useProvider();
    const ENSNames = useENSNames(provider);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        void metaMask.connectEagerly().catch((error) => {
            console.debug('Failed to connect eagerly to metamask');
        })
    }, []);

    return (
        <Card chainId={ chainId } isActivating={ isActivating } isActive={ isActive } error={ error }
              ENSNames={ ENSNames } accounts={ accounts } provider={ provider }
              setError={ setError }
              connector={ metaMask }/>
    );
}
