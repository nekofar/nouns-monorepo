import { Address, ethereum, Bytes, BigInt, ByteArray } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/index';

import {
  handleMinQuorumVotesBPSSet,
  handleMaxQuorumVotesBPSSet,
  handleQuorumCoefficientSet,
} from '../src/nouns-dao';
import {
  ProposalCreatedWithRequirements,
  ProposalCreatedWithRequirements1,
  VoteCast,
  MinQuorumVotesBPSSet,
  MaxQuorumVotesBPSSet,
  QuorumCoefficientSet,
  ProposalObjectionPeriodSet,
  ProposalUpdated,
  ProposalDescriptionUpdated,
  ProposalTransactionsUpdated,
  EscrowedToFork,
  WithdrawFromForkEscrow,
  ProposalCanceled,
  ProposalVetoed,
  ProposalExecuted,
  ProposalQueued,
  ProposalCreated,
} from '../src/types/NounsDAO/NounsDAO';
import { ProposalCandidateCreated, SignatureAdded } from '../src/types/NounsDAOData/NounsDAOData';
import {
  DelegateChanged,
  DelegateVotesChanged,
  Transfer,
} from '../src/types/NounsToken/NounsToken';
import { BIGINT_ONE, BIGINT_ZERO, ZERO_ADDRESS } from '../src/utils/constants';

export function createProposalCreatedWithRequirementsEventV3(
  input: ProposalCreatedWithRequirementsEvent,
): ProposalCreatedWithRequirements {
  const newEvent = changetype<ProposalCreatedWithRequirements>(newMockEvent());
  newEvent.parameters = [];

  newEvent.parameters.push(
    new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(input.id)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('proposer', ethereum.Value.fromAddress(input.proposer)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('signers', ethereum.Value.fromAddressArray(input.signers)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('targets', ethereum.Value.fromAddressArray(input.targets)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('values', ethereum.Value.fromUnsignedBigIntArray(input.values)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('signatures', ethereum.Value.fromStringArray(input.signatures)),
  );

  newEvent.parameters.push(
    new ethereum.EventParam('calldatas', ethereum.Value.fromBytesArray(input.calldatas)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('startBlock', ethereum.Value.fromUnsignedBigInt(input.startBlock)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('endBlock', ethereum.Value.fromUnsignedBigInt(input.endBlock)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam(
      'updatePeriodEndBlock',
      ethereum.Value.fromUnsignedBigInt(input.updatePeriodEndBlock),
    ),
  );
  newEvent.parameters.push(
    new ethereum.EventParam(
      'proposalThreshold',
      ethereum.Value.fromUnsignedBigInt(input.proposalThreshold),
    ),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('quorumVotes', ethereum.Value.fromUnsignedBigInt(input.quorumVotes)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('description', ethereum.Value.fromString(input.description)),
  );

  newEvent.block.number = input.eventBlockNumber;

  return newEvent;
}

export class ProposalCreatedWithRequirementsEvent {
  id: BigInt;
  proposer: Address;
  signers: Address[];
  targets: Address[];
  values: BigInt[];
  signatures: string[];
  calldatas: Bytes[];
  startBlock: BigInt;
  endBlock: BigInt;
  updatePeriodEndBlock: BigInt;
  proposalThreshold: BigInt;
  quorumVotes: BigInt;
  description: string;
  eventBlockNumber: BigInt;
}

export function createProposalCreatedWithRequirementsEventV1(
  input: ProposalCreatedWithRequirementsEvent,
): ProposalCreatedWithRequirements1 {
  const newEvent = changetype<ProposalCreatedWithRequirements1>(newMockEvent());
  newEvent.parameters = [];

  newEvent.parameters.push(
    new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(input.id)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('proposer', ethereum.Value.fromAddress(input.proposer)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('targets', ethereum.Value.fromAddressArray(input.targets)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('values', ethereum.Value.fromUnsignedBigIntArray(input.values)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('signatures', ethereum.Value.fromStringArray(input.signatures)),
  );

  newEvent.parameters.push(
    new ethereum.EventParam('calldatas', ethereum.Value.fromBytesArray(input.calldatas)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('startBlock', ethereum.Value.fromUnsignedBigInt(input.startBlock)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('endBlock', ethereum.Value.fromUnsignedBigInt(input.endBlock)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam(
      'proposalThreshold',
      ethereum.Value.fromUnsignedBigInt(input.proposalThreshold),
    ),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('quorumVotes', ethereum.Value.fromUnsignedBigInt(input.quorumVotes)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('description', ethereum.Value.fromString(input.description)),
  );

  newEvent.block.number = input.eventBlockNumber;

  return newEvent;
}

export function stubProposalCreatedWithRequirementsEventInput(
  eventBlockNumber: BigInt = BIGINT_ZERO,
  signers: Address[] = [],
): ProposalCreatedWithRequirementsEvent {
  return {
    id: BigInt.fromI32(1),
    proposer: Address.fromString('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'),
    signers: signers,
    targets: [Address.fromString('0x000000000000000000000000000000000000dEaD')],
    values: [BigInt.fromI32(0)],
    signatures: ['some signature'],
    calldatas: [changetype<Bytes>(ByteArray.fromBigInt(BIGINT_ONE))],
    startBlock: BigInt.fromI32(203),
    endBlock: BigInt.fromI32(303),
    updatePeriodEndBlock: BigInt.fromI32(103),
    proposalThreshold: BIGINT_ONE,
    quorumVotes: BIGINT_ONE,
    description: 'some description',
    eventBlockNumber: eventBlockNumber,
  };
}

export function createVoteCastEvent(
  voter: Address,
  proposalId: BigInt,
  support: i32,
  votes: BigInt,
): VoteCast {
  const newEvent = changetype<VoteCast>(newMockEvent());
  newEvent.parameters = [];

  newEvent.parameters.push(new ethereum.EventParam('voter', ethereum.Value.fromAddress(voter)));
  newEvent.parameters.push(
    new ethereum.EventParam('proposalId', ethereum.Value.fromUnsignedBigInt(proposalId)),
  );
  newEvent.parameters.push(new ethereum.EventParam('support', ethereum.Value.fromI32(support)));
  newEvent.parameters.push(
    new ethereum.EventParam('votes', ethereum.Value.fromUnsignedBigInt(votes)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('reason', ethereum.Value.fromString('some reason')),
  );

  return newEvent;
}

export function createMinQuorumVotesBPSSetEvent(
  oldMinQuorumVotesBPS: i32,
  newMinQuorumVotesBPS: i32,
): MinQuorumVotesBPSSet {
  const newEvent = changetype<MinQuorumVotesBPSSet>(newMockEvent());
  newEvent.block.number = BIGINT_ZERO;
  newEvent.parameters = [];

  newEvent.parameters.push(
    new ethereum.EventParam('oldMinQuorumVotesBPS', ethereum.Value.fromI32(oldMinQuorumVotesBPS)),
  );

  newEvent.parameters.push(
    new ethereum.EventParam('newMinQuorumVotesBPS', ethereum.Value.fromI32(newMinQuorumVotesBPS)),
  );

  return newEvent;
}

export function createMaxQuorumVotesBPSSetEvent(
  oldMaxQuorumVotesBPS: i32,
  newMaxQuorumVotesBPS: i32,
): MaxQuorumVotesBPSSet {
  const newEvent = changetype<MaxQuorumVotesBPSSet>(newMockEvent());
  newEvent.block.number = BIGINT_ZERO;
  newEvent.parameters = [];

  newEvent.parameters.push(
    new ethereum.EventParam('oldMaxQuorumVotesBPS', ethereum.Value.fromI32(oldMaxQuorumVotesBPS)),
  );

  newEvent.parameters.push(
    new ethereum.EventParam('newMaxQuorumVotesBPS', ethereum.Value.fromI32(newMaxQuorumVotesBPS)),
  );

  return newEvent;
}

export function createQuorumCoefficientSetEvent(
  oldQuorumCoefficient: BigInt,
  newQuorumCoefficient: BigInt,
): QuorumCoefficientSet {
  const newEvent = changetype<QuorumCoefficientSet>(newMockEvent());
  newEvent.block.number = BIGINT_ZERO;
  newEvent.parameters = [];

  newEvent.parameters.push(
    new ethereum.EventParam(
      'oldQuorumCoefficient',
      ethereum.Value.fromUnsignedBigInt(oldQuorumCoefficient),
    ),
  );

  newEvent.parameters.push(
    new ethereum.EventParam(
      'newQuorumCoefficient',
      ethereum.Value.fromUnsignedBigInt(newQuorumCoefficient),
    ),
  );

  return newEvent;
}

export function handleAllQuorumParamEvents(
  newMinQuorumVotesBPS: i32,
  newMaxQuorumVotesBPS: i32,
  newCoefficient: BigInt,
): void {
  handleMinQuorumVotesBPSSet(createMinQuorumVotesBPSSetEvent(0, newMinQuorumVotesBPS));
  handleMaxQuorumVotesBPSSet(createMaxQuorumVotesBPSSetEvent(0, newMaxQuorumVotesBPS));
  handleQuorumCoefficientSet(createQuorumCoefficientSetEvent(BIGINT_ZERO, newCoefficient));
}

export function createProposalObjectionPeriodSetEvent(
  proposalId: BigInt,
  objectionPeriodEndBlock: BigInt,
): ProposalObjectionPeriodSet {
  const newEvent = changetype<ProposalObjectionPeriodSet>(newMockEvent());
  newEvent.parameters = [];

  newEvent.parameters.push(
    new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(proposalId)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam(
      'objectionPeriodEndBlock',
      ethereum.Value.fromUnsignedBigInt(objectionPeriodEndBlock),
    ),
  );

  return newEvent;
}

export function createProposalUpdatedEvent(
  txHash: Bytes,
  logIndex: BigInt,
  blockTimestamp: BigInt,
  blockNumber: BigInt,
  proposalId: BigInt,
  proposer: Address,
  targets: Address[],
  values: BigInt[],
  signatures: string[],
  calldatas: Bytes[],
  description: string,
  updateMessage: string,
): ProposalUpdated {
  const newEvent = changetype<ProposalUpdated>(newMockEvent());

  newEvent.transaction.hash = txHash;
  newEvent.logIndex = logIndex;
  newEvent.block.timestamp = blockTimestamp;
  newEvent.block.number = blockNumber;

  newEvent.parameters = [];
  newEvent.parameters.push(
    new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(proposalId)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('proposer', ethereum.Value.fromAddress(proposer)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('targets', ethereum.Value.fromAddressArray(targets)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('values', ethereum.Value.fromUnsignedBigIntArray(values)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('signatures', ethereum.Value.fromStringArray(signatures)),
  );

  newEvent.parameters.push(
    new ethereum.EventParam('calldatas', ethereum.Value.fromBytesArray(calldatas)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('description', ethereum.Value.fromString(description)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('updateMessage', ethereum.Value.fromString(updateMessage)),
  );

  return newEvent;
}

export function createProposalCandidateCreatedEvent(
  txHash: Bytes,
  logIndex: BigInt,
  blockTimestamp: BigInt,
  blockNumber: BigInt,
  sender: Address,
  targets: Address[],
  values: BigInt[],
  signatures: string[],
  calldatas: Bytes[],
  description: string,
  slug: string,
  encodedProposalHash: Bytes,
): ProposalCandidateCreated {
  const newEvent = changetype<ProposalCandidateCreated>(newMockEvent());

  newEvent.transaction.hash = txHash;
  newEvent.logIndex = logIndex;
  newEvent.block.timestamp = blockTimestamp;
  newEvent.block.number = blockNumber;

  newEvent.parameters = [];
  newEvent.parameters.push(
    new ethereum.EventParam('msgSender', ethereum.Value.fromAddress(sender)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('targets', ethereum.Value.fromAddressArray(targets)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('values', ethereum.Value.fromUnsignedBigIntArray(values)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('signatures', ethereum.Value.fromStringArray(signatures)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('calldatas', ethereum.Value.fromBytesArray(calldatas)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('description', ethereum.Value.fromString(description)),
  );
  newEvent.parameters.push(new ethereum.EventParam('slug', ethereum.Value.fromString(slug)));
  newEvent.parameters.push(
    new ethereum.EventParam('proposalIdToUpdate', ethereum.Value.fromUnsignedBigInt(BIGINT_ZERO)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('encodedProposalHash', ethereum.Value.fromBytes(encodedProposalHash)),
  );

  return newEvent;
}

export function createSignatureAddedEvent(
  signer: Address,
  sig: Bytes,
  expirationTimestamp: BigInt,
  proposer: Address,
  slug: string,
  encodedPropHash: Bytes,
  sigDigest: Bytes,
  reason: string,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): SignatureAdded {
  const newEvent = changetype<SignatureAdded>(newMockEvent());
  newEvent.block.timestamp = blockTimestamp;
  newEvent.block.number = blockNumber;

  newEvent.parameters.push(new ethereum.EventParam('signer', ethereum.Value.fromAddress(signer)));
  newEvent.parameters.push(new ethereum.EventParam('sig', ethereum.Value.fromBytes(sig)));
  newEvent.parameters.push(
    new ethereum.EventParam(
      'expirationTimestamp',
      ethereum.Value.fromUnsignedBigInt(expirationTimestamp),
    ),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('proposer', ethereum.Value.fromAddress(proposer)),
  );
  newEvent.parameters.push(new ethereum.EventParam('slug', ethereum.Value.fromString(slug)));
  newEvent.parameters.push(
    new ethereum.EventParam('proposalIdToUpdate', ethereum.Value.fromUnsignedBigInt(BIGINT_ZERO)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('encodedPropHash', ethereum.Value.fromBytes(encodedPropHash)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('sigDigest', ethereum.Value.fromBytes(sigDigest)),
  );
  newEvent.parameters.push(new ethereum.EventParam('reason', ethereum.Value.fromString(reason)));

  return newEvent;
}

export function createProposalDescriptionUpdatedEvent(
  txHash: Bytes,
  logIndex: BigInt,
  blockTimestamp: BigInt,
  blockNumber: BigInt,
  proposalId: BigInt,
  proposer: Address,
  description: string,
  updateMessage: string,
): ProposalDescriptionUpdated {
  const newEvent = changetype<ProposalDescriptionUpdated>(newMockEvent());

  newEvent.transaction.hash = txHash;
  newEvent.logIndex = logIndex;
  newEvent.block.timestamp = blockTimestamp;
  newEvent.block.number = blockNumber;

  newEvent.parameters = [];
  newEvent.parameters.push(
    new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(proposalId)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('proposer', ethereum.Value.fromAddress(proposer)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('description', ethereum.Value.fromString(description)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('updateMessage', ethereum.Value.fromString(updateMessage)),
  );

  return newEvent;
}

export function createProposalTransactionsUpdatedEvent(
  txHash: Bytes,
  logIndex: BigInt,
  blockTimestamp: BigInt,
  blockNumber: BigInt,
  proposalId: BigInt,
  proposer: Address,
  targets: Address[],
  values: BigInt[],
  signatures: string[],
  calldatas: Bytes[],
  updateMessage: string,
): ProposalTransactionsUpdated {
  const newEvent = changetype<ProposalTransactionsUpdated>(newMockEvent());

  newEvent.transaction.hash = txHash;
  newEvent.logIndex = logIndex;
  newEvent.block.timestamp = blockTimestamp;
  newEvent.block.number = blockNumber;

  newEvent.parameters = [];
  newEvent.parameters.push(
    new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(proposalId)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('proposer', ethereum.Value.fromAddress(proposer)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('targets', ethereum.Value.fromAddressArray(targets)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('values', ethereum.Value.fromUnsignedBigIntArray(values)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('signatures', ethereum.Value.fromStringArray(signatures)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('calldatas', ethereum.Value.fromBytesArray(calldatas)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('updateMessage', ethereum.Value.fromString(updateMessage)),
  );

  return newEvent;
}

export function createEscrowedToForkEvent(
  txHash: Bytes,
  logIndex: BigInt,
  blockTimestamp: BigInt,
  owner: Address,
  tokenIds: Array<BigInt>,
  proposalIds: Array<BigInt>,
  reason: string,
  forkId: BigInt,
): EscrowedToFork {
  const newEvent = changetype<EscrowedToFork>(newMockEvent());

  newEvent.transaction.hash = txHash;
  newEvent.logIndex = logIndex;
  newEvent.block.timestamp = blockTimestamp;

  newEvent.parameters = [];
  newEvent.parameters.push(
    new ethereum.EventParam('forkId', ethereum.Value.fromUnsignedBigInt(forkId)),
  );
  newEvent.parameters.push(new ethereum.EventParam('owner', ethereum.Value.fromAddress(owner)));
  newEvent.parameters.push(
    new ethereum.EventParam('tokenIds', ethereum.Value.fromUnsignedBigIntArray(tokenIds)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('proposalIds', ethereum.Value.fromUnsignedBigIntArray(proposalIds)),
  );
  newEvent.parameters.push(new ethereum.EventParam('reason', ethereum.Value.fromString(reason)));

  return newEvent;
}

export function createWithdrawFromForkEscrowEvent(
  txHash: Bytes,
  logIndex: BigInt,
  blockTimestamp: BigInt,
  owner: Address,
  tokenIds: Array<BigInt>,
  forkId: BigInt,
): WithdrawFromForkEscrow {
  const newEvent = changetype<WithdrawFromForkEscrow>(newMockEvent());

  newEvent.transaction.hash = txHash;
  newEvent.logIndex = logIndex;
  newEvent.block.timestamp = blockTimestamp;

  newEvent.parameters = [];
  newEvent.parameters.push(
    new ethereum.EventParam('forkId', ethereum.Value.fromUnsignedBigInt(forkId)),
  );
  newEvent.parameters.push(new ethereum.EventParam('owner', ethereum.Value.fromAddress(owner)));
  newEvent.parameters.push(
    new ethereum.EventParam('tokenIds', ethereum.Value.fromUnsignedBigIntArray(tokenIds)),
  );

  return newEvent;
}

export function createProposalCanceledEvent(
  txHash: Bytes,
  logIndex: BigInt,
  blockTimestamp: BigInt,
  blockNumber: BigInt,
  proposalId: BigInt,
): ProposalCanceled {
  const newEvent = changetype<ProposalCanceled>(newMockEvent());

  newEvent.transaction.hash = txHash;
  newEvent.logIndex = logIndex;
  newEvent.block.timestamp = blockTimestamp;
  newEvent.block.number = blockNumber;

  newEvent.parameters = [];
  newEvent.parameters.push(
    new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(proposalId)),
  );

  return newEvent;
}

export function createProposalVetoedEvent(
  txHash: Bytes,
  logIndex: BigInt,
  blockTimestamp: BigInt,
  blockNumber: BigInt,
  proposalId: BigInt,
): ProposalVetoed {
  const newEvent = changetype<ProposalVetoed>(newMockEvent());

  newEvent.transaction.hash = txHash;
  newEvent.logIndex = logIndex;
  newEvent.block.timestamp = blockTimestamp;
  newEvent.block.number = blockNumber;

  newEvent.parameters = [];
  newEvent.parameters.push(
    new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(proposalId)),
  );

  return newEvent;
}

export function createProposalExecutedEvent(
  txHash: Bytes,
  logIndex: BigInt,
  blockTimestamp: BigInt,
  blockNumber: BigInt,
  proposalId: BigInt,
): ProposalExecuted {
  const newEvent = changetype<ProposalExecuted>(newMockEvent());

  newEvent.transaction.hash = txHash;
  newEvent.logIndex = logIndex;
  newEvent.block.timestamp = blockTimestamp;
  newEvent.block.number = blockNumber;

  newEvent.parameters = [];
  newEvent.parameters.push(
    new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(proposalId)),
  );

  return newEvent;
}

export function createProposalQueuedEvent(
  txHash: Bytes,
  logIndex: BigInt,
  blockTimestamp: BigInt,
  blockNumber: BigInt,
  proposalId: BigInt,
  eta: BigInt,
): ProposalQueued {
  const newEvent = changetype<ProposalQueued>(newMockEvent());

  newEvent.transaction.hash = txHash;
  newEvent.logIndex = logIndex;
  newEvent.block.timestamp = blockTimestamp;
  newEvent.block.number = blockNumber;

  newEvent.parameters = [];
  newEvent.parameters.push(
    new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(proposalId)),
  );

  newEvent.parameters.push(new ethereum.EventParam('eta', ethereum.Value.fromUnsignedBigInt(eta)));

  return newEvent;
}

export function createTransferEvent(
  txHash: Bytes,
  logIndex: BigInt,
  blockTimestamp: BigInt,
  blockNumber: BigInt,
  from: Address,
  to: Address,
  tokenId: BigInt,
): Transfer {
  const newEvent = changetype<Transfer>(newMockEvent());

  newEvent.transaction.hash = txHash;
  newEvent.logIndex = logIndex;
  newEvent.block.timestamp = blockTimestamp;
  newEvent.block.number = blockNumber;

  newEvent.parameters = [];
  newEvent.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(from)));
  newEvent.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(to)));
  newEvent.parameters.push(
    new ethereum.EventParam('tokenId', ethereum.Value.fromUnsignedBigInt(tokenId)),
  );

  return newEvent;
}

export function createDelegateChangedEvent(
  txHash: Bytes,
  logIndex: BigInt,
  blockTimestamp: BigInt,
  blockNumber: BigInt,
  delegator: Address,
  previousDelegate: Address,
  newDelegate: Address,
): DelegateChanged {
  const newEvent = changetype<DelegateChanged>(newMockEvent());

  newEvent.transaction.hash = txHash;
  newEvent.logIndex = logIndex;
  newEvent.block.timestamp = blockTimestamp;
  newEvent.block.number = blockNumber;

  newEvent.parameters = [];
  newEvent.parameters.push(
    new ethereum.EventParam('delegator', ethereum.Value.fromAddress(delegator)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('previousDelegate', ethereum.Value.fromAddress(previousDelegate)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('newDelegate', ethereum.Value.fromAddress(newDelegate)),
  );

  return newEvent;
}

export function createDelegateVotesChangedEvent(
  txHash: Bytes,
  logIndex: BigInt,
  blockTimestamp: BigInt,
  blockNumber: BigInt,
  delegate: Address,
  previousBalance: BigInt,
  newBalance: BigInt,
): DelegateVotesChanged {
  const newEvent = changetype<DelegateVotesChanged>(newMockEvent());

  newEvent.transaction.hash = txHash;
  newEvent.logIndex = logIndex;
  newEvent.block.timestamp = blockTimestamp;
  newEvent.block.number = blockNumber;

  newEvent.parameters = [];
  newEvent.parameters.push(
    new ethereum.EventParam('delegate', ethereum.Value.fromAddress(delegate)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('previousBalance', ethereum.Value.fromUnsignedBigInt(previousBalance)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('newBalance', ethereum.Value.fromUnsignedBigInt(newBalance)),
  );

  return newEvent;
}

export class ProposalCreatedData {
  id: BigInt = BIGINT_ZERO;
  proposer: Address = Address.fromString(ZERO_ADDRESS);
  signers: Address[] = [];
  targets: Address[] = [];
  values: BigInt[] = [];
  signatures: string[] = [];
  calldatas: Bytes[] = [];
  startBlock: BigInt = BIGINT_ZERO;
  endBlock: BigInt = BIGINT_ZERO;
  description: string = '';
  eventBlockNumber: BigInt = BIGINT_ZERO;
  eventBlockTimestamp: BigInt = BIGINT_ZERO;
  txHash: Bytes = Bytes.fromI32(0);
  logIndex: BigInt = BIGINT_ZERO;
  address: Address = Address.fromString(ZERO_ADDRESS);
}

export function createProposalCreatedEvent(input: ProposalCreatedData): ProposalCreated {
  const newEvent = changetype<ProposalCreated>(newMockEvent());
  newEvent.parameters = [];

  newEvent.parameters.push(
    new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(input.id)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('proposer', ethereum.Value.fromAddress(input.proposer)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('targets', ethereum.Value.fromAddressArray(input.targets)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('values', ethereum.Value.fromUnsignedBigIntArray(input.values)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('signatures', ethereum.Value.fromStringArray(input.signatures)),
  );

  newEvent.parameters.push(
    new ethereum.EventParam('calldatas', ethereum.Value.fromBytesArray(input.calldatas)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('startBlock', ethereum.Value.fromUnsignedBigInt(input.startBlock)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('endBlock', ethereum.Value.fromUnsignedBigInt(input.endBlock)),
  );
  newEvent.parameters.push(
    new ethereum.EventParam('description', ethereum.Value.fromString(input.description)),
  );

  newEvent.block.number = input.eventBlockNumber;
  newEvent.block.timestamp = input.eventBlockTimestamp;
  newEvent.transaction.hash = input.txHash;
  newEvent.logIndex = input.logIndex;
  newEvent.address = input.address;

  return newEvent;
}
