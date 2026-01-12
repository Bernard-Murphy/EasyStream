import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Stream: "Stream";
    readonly StreamPosition: "StreamPosition";
    readonly ChatMessage: "ChatMessage";
    readonly User: "User";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const StreamScalarFieldEnum: {
    readonly id: "id";
    readonly uuid: "uuid";
    readonly start_time: "start_time";
    readonly end_time: "end_time";
    readonly anon_id: "anon_id";
    readonly anon_text_color: "anon_text_color";
    readonly anon_background_color: "anon_background_color";
    readonly title: "title";
    readonly description: "description";
    readonly status: "status";
    readonly removed: "removed";
    readonly fileUrls: "fileUrls";
    readonly thumbnailUrl: "thumbnailUrl";
};
export type StreamScalarFieldEnum = (typeof StreamScalarFieldEnum)[keyof typeof StreamScalarFieldEnum];
export declare const StreamPositionScalarFieldEnum: {
    readonly id: "id";
    readonly stream_id: "stream_id";
    readonly stage: "stage";
    readonly peer_id: "peer_id";
    readonly parents: "parents";
    readonly children: "children";
};
export type StreamPositionScalarFieldEnum = (typeof StreamPositionScalarFieldEnum)[keyof typeof StreamPositionScalarFieldEnum];
export declare const ChatMessageScalarFieldEnum: {
    readonly id: "id";
    readonly uuid: "uuid";
    readonly create_date: "create_date";
    readonly anon_id: "anon_id";
    readonly anon_text_color: "anon_text_color";
    readonly anon_background_color: "anon_background_color";
    readonly name: "name";
    readonly message: "message";
    readonly removed: "removed";
    readonly stream_id: "stream_id";
};
export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly username: "username";
    readonly email: "email";
    readonly create_date: "create_date";
    readonly password_hash: "password_hash";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
