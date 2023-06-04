# Project to accept payments in ERC20 tokens or native tokens

### Features
* generate addresses for specific identifier (like customerId)
* monitor balance on sub accounts
* withdraw funds from subaccounts with minimal network fees (will take the biggest first to reduce number of transactions)

### Flow
1. user generates seed phrase + 
2. user register using seed phrase and password(salt) and callback url +
3. now user can use basic auth using his login password +
4. user call method getSubAccount guarded. passing blockchain, identifier (his customer`s id). we generate account by inc derivation index +
5. we send POST request {
    data: Buffer.from(JSON.stringify({amount: receivedAmount, token: tokenName, txHash: 'hash of the transaction', blockchain: 'blockchainName'})).toString('base64')
    signature: *data hashed by his seed phrase and password*
} WIP
6. user wants to take some funds amount from his accounts, we calculate best set of transactions, fees. and processing all the transactions WIP


TODO:
callback
withdraw
frontend interface
docker compose for single line bootstrap