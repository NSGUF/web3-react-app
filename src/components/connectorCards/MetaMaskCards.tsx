import { hooks, metaMask } from "../../connectors/metaMask";
import { useEffect, useState } from "react";
import { Card } from "../Card";
import InfoAbi from '../../abi/InfoContract.json';
import { Contract } from 'ethers';

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

    useEffect(() => {
        console.log('provider:', provider);
    }, [provider]);

    const ENSNames = useENSNames(provider);
    const [isPending, setPending] = useState(false);
    const [error, setError] = useState(undefined);

    const address = InfoAbi.networks[5777].address;

    // console.log('合约地址: ', address);
    useEffect(() => {
        void metaMask.connectEagerly().catch((error) => {
            console.debug('Failed to connect eagerly to metamask');
        })
    }, []);

    return (
        <>
            <Card chainId={ chainId } isActivating={ isActivating } isActive={ isActive } error={ error }
                  ENSNames={ ENSNames } accounts={ accounts } provider={ provider }
                  setError={ setError }
                  connector={ metaMask }/>
            <hr/>
            <input
    type="button"
    value="调用合约"
    disabled={ isPending }
    onClick={ async () => {
        setPending(true);
        const signer = await provider?.getSigner();
        if (provider) {
            const contract = new Contract(address, InfoAbi.abi, signer);
            const result = await contract.setInfo(
                'nsguf',
                parseInt((Math.random() * 20).toString(), 10)
            );
            const transactionReceipt = await provider?.waitForTransaction(
                result.hash
            );
            console.log(
                '监听当前hash挖掘的收据交易状态【为1代表交易成功、为0代表交易失败】transactionReceipt.status：',
                transactionReceipt?.status
            );
            console.log(
                '监听当前hash挖掘的收据交易event事件日志transactionReceipt.logs：',
                transactionReceipt?.logs
            );
            if (
                transactionReceipt?.status === 1 &&
                transactionReceipt.logs.length !== 0
            ) {
                //大大的loading
                setPending(false);
            }
        }
    } }
    />
        </>
    );
}
