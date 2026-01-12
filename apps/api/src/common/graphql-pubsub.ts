import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

export const TOPIC_CHAT_MESSAGE_ADDED = 'CHAT_MESSAGE_ADDED';
export const TOPIC_HIERARCHY_UPDATED = 'HIERARCHY_UPDATED';
export const TOPIC_STREAM_UPDATED = 'STREAM_UPDATED';
export const TOPIC_SIGNAL_RECEIVED = 'SIGNAL_RECEIVED';


