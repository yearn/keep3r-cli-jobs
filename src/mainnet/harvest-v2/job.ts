import { createForks, GanacheFork, getStealthHash, Job, JobWorkableGroup, makeid, prelog, TransactionError } from '@keep3r-network/cli-utils';
import { getMainnetSdk } from '../../eth-sdk-build';
import metadata from './metadata.json';

// create an array that holds the expected errors to make them more readable
const expectedErrors: string[] = ['V2Keep3rJob::work:not-workable', '!authorized', '!healthcheck'];

// establish the maximum amount of strategies per fork
const maxStrategiesPerFork = 5;

const getWorkableTxs: Job['getWorkableTxs'] = async (args) => {
  // setup logs
  const logMetadata = {
    job: metadata.name,
    block: args.advancedBlock,
    logId: makeid(5),
  };

  const logConsole = prelog(logMetadata);

  logConsole.log(`Trying to work`);

  // setup job with default fork provider
  const signer = args.fork.ethersProvider.getSigner(args.keeperAddress);
  const { harvestJob: job } = getMainnetSdk(signer);

  // get strategies to work
  const strategies: string[] = args.retryId ? [args.retryId] : await job.strategies();
  logConsole.log(args.retryId ? `Retrying strategy` : `Simulating ${strategies.length} strategies`);

  // create needed forks in order to work in parallel
  const forksToCreate = Math.ceil(strategies.length / maxStrategiesPerFork) - 1;
  const forks: GanacheFork[] = [args.fork, ...(await createForks(forksToCreate, args))];
  logConsole.debug(`Created ${forks.length} forks in order to work in parellel`);

  // for each fork
  const workPromises = forks.map(async (fork, forkIndex) => {
    // setup job and stealth relayer using fork provider
    const signer = fork.ethersProvider.getSigner(args.keeperAddress);
    const { harvestJob: job, stealthRelayer } = getMainnetSdk(signer);
    const forkStrategies = strategies.slice(forkIndex * maxStrategiesPerFork, forkIndex * maxStrategiesPerFork + maxStrategiesPerFork);

    // for each strategy
    for (const [index, strategy] of forkStrategies.entries()) {
      // setup logs for strategy
      const strategyIndex = forkIndex * maxStrategiesPerFork + index;
      const strategyLogId = `${logMetadata.logId}-${makeid(5)}`;
      const strategyConsole = prelog({ ...logMetadata, logId: strategyLogId });

      // skip strategy if already in progress
      if (args.skipIds.includes(strategy)) {
        strategyConsole.info('Skipping strategy', { strategy });
        continue;
      }

      // encode function data and get stealth hash
      const workData: string = job.interface.encodeFunctionData('work', [strategy]);
      const stealthHash: string = getStealthHash();

      try {
        // check if strategy is workable
        await stealthRelayer.connect(args.keeperAddress).callStatic.execute(job.address, workData, stealthHash, args.advancedBlock, {
          blockTag: args.advancedBlock,
        });

        strategyConsole.log(`Strategy #${strategyIndex} is workable`, { strategy });

        // create work tx
        const tx = await stealthRelayer
          .connect(args.keeperAddress)
          .populateTransaction.execute(job.address, workData, stealthHash, args.targetBlock + index, {
            nonce: args.keeperNonce,
            gasLimit: 5_000_000,
            type: 2,
          });

        // create a workable group every bundle burst
        const workableGroups: JobWorkableGroup[] = new Array(args.bundleBurst).fill(null).map((_, index) => ({
          targetBlock: args.targetBlock + index,
          txs: [tx],
          logId: `${strategyLogId}-${makeid(5)}`,
        }));

        // submit all bundles
        args.subject.next({
          workableGroups,
          correlationId: strategy,
        });
      } catch (err: any) {
        // handle error logs
        const isExpectedError = expectedErrors.find((expectedError) => {
          return (err as TransactionError).message?.includes(expectedError);
        });

        if (!isExpectedError) {
          strategyConsole.warn(`Strategy #${strategyIndex} failed with unknown error`, {
            strategy,
            message: err.message,
          });
        } else {
          strategyConsole.log(`Strategy #${strategyIndex} is not workable`, { strategy });
        }
      }
    }
  });

  // wait for all parallel forks to finish
  await Promise.all(workPromises);

  // finish job process
  args.subject.complete();
};

module.exports = {
  getWorkableTxs,
} as Job;
