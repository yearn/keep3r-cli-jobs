[![image](https://img.shields.io/npm/v/@yfi/keep3r-cli-jobs.svg?style=flat-square)](https://www.npmjs.org/package/@yfi/keep3r-cli-jobs)

# Yearn Keep3r CLI Jobs

This repository contains the scripts to run Yearn's jobs.

## How to Install

- Install the package

`
yarn add @yfi/keep3r-cli-jobs
`

- Add the jobs to you configuration file

```
    {
        ...
        "jobs" : [
            ...,
            {
                "path": "node_modules/@yfi/keep3r-cli-jobs/dist/src/mainnet/harvest-v2"
            },
            {
                "path": "node_modules/@yfi/keep3r-cli-jobs/dist/src/mainnet/tend-v2"
            },
            {
                "path": "node_modules/@yfi/keep3r-cli-jobs/dist/src/mainnet/tend-v2-beta"
            }
        ]
    }
```

- Run the Keep3r CLI


For further information about the jobs, follow the individual guides:

- [Harvest-V2](https://github.com/yearn/keep3r-cli-jobs/blob/main/src/mainnet/harvest-v2/README.md)
- [Tend-V2](https://github.com/yearn/keep3r-cli-jobs/blob/main/src/mainnet/tend-v2/README.md)
- [Tend-V2 (Beta)](https://github.com/yearn/keep3r-cli-jobs/blob/main/src/mainnet/tend-v2-beta/README.md)



