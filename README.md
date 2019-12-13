# Blockchain-2019

## Instructions to run application
Clone Repo


run command:
```
npm install
```


Install Dependancies:
Truffle: https://github.com/trufflesuite/truffle or `npm install -g truffle`


Ganache: http://truffleframework.com/ganache/

Run Ganache


Metamask: https://metamask.io/

Setup follow metamask account
and import an account provided by ganache


on metamask extension:
Switch network to `Custom RPC`
Enter in the URL shown on Ganache
in settings, go to: general > connections > add site > "localhost"

On a command prompt:
```
truffle migrate --reset
```

run the local server from command prompt
```
npm run dev
```
