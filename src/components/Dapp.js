import React, {useEffect, useState} from 'react';
import {useContract, useNetwork, useSigner, useSignMessage} from "wagmi";
import contractABI from "../contracts/contractABI.json"
import {formatEther, parseEther, verifyMessage} from "ethers/lib/utils";
import {ethers} from "ethers";

function Dapp() {
    const account = useSigner();

    // useProvider() method exceeded request rate, working with only injected provider.
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { activeChain } = useNetwork();

    const [signSuccess, setSignSuccess] = useState('');
    const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
        message: 'Upon signing this message I agree to sell my soul to Dragos.',
        onSuccess(data, variables){
            const address = verifyMessage(variables.message, data);
            // Displaying the signee address (your address) when indeed you are the one signing.
            setSignSuccess(address);
        }
    });

    const contract = useContract({
        addressOrName: '0x4b5175442b77687C5370Db40dD50bba8b9746E35',
        contractInterface: contractABI.abi,
        signerOrProvider: account.data || provider
    });

    const [status, setStatus] = useState("");

    const [number, setNumber] = useState(0);
    const [getter, setGetter] = useState(0);
    const [deposit, setDeposit] = useState(0);

    const set = async () => {
        const param = number;
        const tx = await contract.set(parseEther(param.toString()));
        await tx.wait();
        setGetter(formatEther(param));
        setStatus("You have successfully set number " + param + " .");
    }

    const get = async () => {
        const tx = await contract.get();
        setGetter(formatEther(tx));
    }

    const depositTokens = async () => {
        const param = deposit;
        const tx = await contract.deposit({value: parseEther(param.toString())});
        await tx.wait();
        setStatus("You have successfully deposited " + param + " ethers.");
    }

    const withdrawTokens = async () => {
        const tx = await contract.withdraw();
        await tx.wait();
        setStatus("You have successfully withdrawn the contract's funds, boss.");
    }

    useEffect(() => {
        get();
    });


    if(account.data && activeChain.id === 4)
        return (
            <div className={'flex flex-col space-y-4'}>
                <div>
                    <button className={'p-4'} disabled={isLoading} onClick={() => signMessage()}>
                        Sign message
                    </button>
                    {isSuccess && <div> <p>Signee : {signSuccess}</p> <p>Signature : {data}</p> </div>}
                    {isError && <div>Error signing message</div>}
                </div>
                <div>
                    <button className={'p-4'} onClick={set}>Set Number</button>
                    <input type={'number'} placeholder={'0'} min={0} className={'p-2 text-center'}
                    onChange={(event) => {setNumber(event.target.value)}}/>
                </div>
                <div>
                    Number : {getter}
                </div>
                <div>
                    <button className={'p-4'} onClick={depositTokens}>Deposit Ether</button>
                    <input type={'number'} step={'0.001'} placeholder={'0'} min={0} className={'p-2 text-center'}
                    onChange={(event) => {setDeposit(event.target.value)}}/>
                </div>
                <div>
                    <button className={'p-4'} onClick={withdrawTokens}>Withdraw Funds</button>
                </div>
                <div>
                    <p className={'text-green-600'}>{status}</p>
                </div>

            </div>
        );

    return (
        <div>
            <p>Please switch to Rinkeby.</p>
        </div>
    );
}

export default Dapp;