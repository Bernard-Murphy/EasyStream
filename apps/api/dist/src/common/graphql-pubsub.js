"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOPIC_SIGNAL_RECEIVED = exports.TOPIC_STREAM_UPDATED = exports.TOPIC_HIERARCHY_UPDATED = exports.TOPIC_CHAT_MESSAGE_ADDED = exports.pubsub = void 0;
const graphql_subscriptions_1 = require("graphql-subscriptions");
exports.pubsub = new graphql_subscriptions_1.PubSub();
exports.TOPIC_CHAT_MESSAGE_ADDED = 'CHAT_MESSAGE_ADDED';
exports.TOPIC_HIERARCHY_UPDATED = 'HIERARCHY_UPDATED';
exports.TOPIC_STREAM_UPDATED = 'STREAM_UPDATED';
exports.TOPIC_SIGNAL_RECEIVED = 'SIGNAL_RECEIVED';
//# sourceMappingURL=graphql-pubsub.js.map