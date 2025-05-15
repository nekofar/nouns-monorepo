import { Handler } from '@netlify/functions';
import * as R from 'remeda';

import { NormalizedVote, nounsQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

interface NounVote {
  id: number;
  owner: string;
  delegatedTo: null | string;
  votes: NormalizedVote[];
}

const buildNounVote = R.pick(['id', 'owner', 'delegatedTo', 'votes']);

const buildNounVotes = R.map(buildNounVote);

const handler: Handler = async (event, context) => {
  const nouns = await nounsQuery();
  const nounVotes: NounVote[] = buildNounVotes(nouns);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(nounVotes),
  };
};

export { handler };
