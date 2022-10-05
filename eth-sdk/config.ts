import { defineConfig } from '@dethcrypto/eth-sdk';

export default defineConfig({
  outputPath: 'src/eth-sdk-build',
  contracts: {
    mainnet: {
      harvestJob: '0x220a85bCd2212ab0b27EFd0de8b5e03175f0adee',
      tendJob: '0xdeE991cbF8527A33E84a2aAb8a65d68D5D591bAa',
      stealthRelayer: '0x0a61c2146A7800bdC278833F21EBf56Cd660EE2a',
    },
  },
});
