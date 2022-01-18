import { Job, JobWorkableGroup, makeid, prelog, TransactionError } from '@keep3r-network/cli-utils';
import { getMainnetSdk } from '../../eth-sdk-build';
import metadata from './metadata.json';

// create an array that holds the expected errors to make them more readable
const expectedErrors: string[] = ['V2Keep3rJob::work:not-workable', '!authorized'];

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
  const { tendJobBeta: job } = getMainnetSdk(signer);

  // get strategies to work
  const strategies: string[] = args.retryId ? [args.retryId] : await job.strategies();
  logConsole.log(args.retryId ? `Retrying strategy` : `Simulating ${strategies.length} strategies`);

  // for each strategy
  for (const [index, strategy] of strategies.entries()) {
    // setup logs for strategy
    const strategyLogId = `${logMetadata.logId}-${makeid(5)}`;
    const strategyConsole = prelog({ ...logMetadata, logId: strategyLogId });

    // skip strategy if already in progress
    if (args.skipIds.includes(strategy)) {
      strategyConsole.info('Skipping strategy', { strategy });
      continue;
    }

    try {
      // check if strategy is workable
      await job.callStatic.work(strategy, {
        blockTag: args.advancedBlock,
      });

      strategyConsole.log(`Strategy #${index} is workable`, { strategy });

      // create work tx
      const tx = await job.populateTransaction.work(strategy, {
        nonce: args.keeperNonce,
        gasLimit: 1_000_000,
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
    } catch (err: unknown) {
      // handle error logs
      const isExpectedError = expectedErrors.find((expectedError) => {
        return (err as TransactionError).message?.includes(expectedError);
      });

      if (!isExpectedError) {
        strategyConsole.warn(`Strategy #${index} failed with unknown error`, {
          strategy,
          message: (err as Error).message,
        });
      } else {
        strategyConsole.log(`Strategy #${index} is not workable`, { strategy });
      }
    }
  }

  // finish job process
  args.subject.complete();
};

module.exports = {
  getWorkableTxs,
} as Job;
