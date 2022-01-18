import { defineConfig } from '@dethcrypto/eth-sdk';

export default defineConfig({
  outputPath: 'src/eth-sdk-build',
  contracts: {
    mainnet: {
      harvestJob: '0x2150b45626199CFa5089368BDcA30cd0bfB152D6',
      tendJob: '0x2ef7801c6A9d451EF20d0F513c738CC012C57bC3',
      tendJobBeta: '0xf72D7E44ec3F79379912B8d0f661bE954a101159',
      stealthRelayer: '0x0a61c2146A7800bdC278833F21EBf56Cd660EE2a',
    },
  },
});
