import { defineConfig } from '@dethcrypto/eth-sdk';

export default defineConfig({
  outputPath: 'src/eth-sdk-build',
  contracts: {
    mainnet: {
      harvestJob: '0xe6dd4b94b0143142e6d7ef3110029c1dce8215cb',
      tendJob: '0xcd7f72f12c4b87dabd31d3aa478a1381150c32b3',
      stealthRelayer: '0x0a61c2146A7800bdC278833F21EBf56Cd660EE2a',
    },
  },
});
