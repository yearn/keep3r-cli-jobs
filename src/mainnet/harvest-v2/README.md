# Yearn Harvest V2 Keep3r CLI Job

Harvests Yearn strategies using stealth transactions.

## Config path

`node_modules/@yfi/keep3r-cli-jobs/dist/src/mainnet/harvest-v2`

## Keeper Requirements

* Must be a valid Keeper on Keep3r V1
* Have at least 50 KP3R bonded on Keep3r V1
* Should not be a contract
* Should at least have 1 ETH bonded on the Stealth Vault
* Should enable Stealth Relayer through the Stealth Vault. This should be done by calling the Vault's method `enableStealthContract`

## Useful Links

* [Job](https://etherscan.io/address/0xe6dd4b94b0143142e6d7ef3110029c1dce8215cb)
* [Job docs](https://github.com/yearn/keep3r-jobs/blob/master/doc/HarvestV2Keep3rStealthJob.md)
* [Stealth Relayer](https://etherscan.io/address/0x0a61c2146A7800bdC278833F21EBf56Cd660EE2a)
* [Stealth Vault](https://etherscan.io/address/0xde2fe402a285363283853bec903d134426db3ff7)
* [Stealth Relayer & Vault docs](https://github.com/yearn/keep3r-jobs/blob/master/doc/working-stealth-jobs.md)
* [Keep3r V2](https://etherscan.io/address/0xeb02addCfD8B773A5FFA6B9d1FE99c566f8c44CC)
