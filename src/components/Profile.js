import {useAccount, useConnect, useNetwork} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

function Profile() {
    const account = useAccount();
    const { activeConnector, connect } = useConnect({
        connector: new InjectedConnector(),
    });
    const { activeChain } = useNetwork();

    if (activeConnector)
        return (
            <div>
                Connected to {account.data.address}
                {activeChain && <div>Connected to {activeChain.name}</div>}

            </div>
        )
    return <button onClick={() => connect()}>Connect Wallet</button>
}

export default Profile;