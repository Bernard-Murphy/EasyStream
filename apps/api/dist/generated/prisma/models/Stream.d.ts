import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type StreamModel = runtime.Types.Result.DefaultSelection<Prisma.$StreamPayload>;
export type AggregateStream = {
    _count: StreamCountAggregateOutputType | null;
    _avg: StreamAvgAggregateOutputType | null;
    _sum: StreamSumAggregateOutputType | null;
    _min: StreamMinAggregateOutputType | null;
    _max: StreamMaxAggregateOutputType | null;
};
export type StreamAvgAggregateOutputType = {
    id: number | null;
};
export type StreamSumAggregateOutputType = {
    id: number | null;
};
export type StreamMinAggregateOutputType = {
    id: number | null;
    uuid: string | null;
    start_time: Date | null;
    end_time: Date | null;
    anon_id: string | null;
    anon_text_color: string | null;
    anon_background_color: string | null;
    title: string | null;
    description: string | null;
    status: $Enums.StreamStatus | null;
    removed: boolean | null;
    thumbnailUrl: string | null;
};
export type StreamMaxAggregateOutputType = {
    id: number | null;
    uuid: string | null;
    start_time: Date | null;
    end_time: Date | null;
    anon_id: string | null;
    anon_text_color: string | null;
    anon_background_color: string | null;
    title: string | null;
    description: string | null;
    status: $Enums.StreamStatus | null;
    removed: boolean | null;
    thumbnailUrl: string | null;
};
export type StreamCountAggregateOutputType = {
    id: number;
    uuid: number;
    start_time: number;
    end_time: number;
    anon_id: number;
    anon_text_color: number;
    anon_background_color: number;
    title: number;
    description: number;
    status: number;
    removed: number;
    fileUrls: number;
    thumbnailUrl: number;
    _all: number;
};
export type StreamAvgAggregateInputType = {
    id?: true;
};
export type StreamSumAggregateInputType = {
    id?: true;
};
export type StreamMinAggregateInputType = {
    id?: true;
    uuid?: true;
    start_time?: true;
    end_time?: true;
    anon_id?: true;
    anon_text_color?: true;
    anon_background_color?: true;
    title?: true;
    description?: true;
    status?: true;
    removed?: true;
    thumbnailUrl?: true;
};
export type StreamMaxAggregateInputType = {
    id?: true;
    uuid?: true;
    start_time?: true;
    end_time?: true;
    anon_id?: true;
    anon_text_color?: true;
    anon_background_color?: true;
    title?: true;
    description?: true;
    status?: true;
    removed?: true;
    thumbnailUrl?: true;
};
export type StreamCountAggregateInputType = {
    id?: true;
    uuid?: true;
    start_time?: true;
    end_time?: true;
    anon_id?: true;
    anon_text_color?: true;
    anon_background_color?: true;
    title?: true;
    description?: true;
    status?: true;
    removed?: true;
    fileUrls?: true;
    thumbnailUrl?: true;
    _all?: true;
};
export type StreamAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StreamWhereInput;
    orderBy?: Prisma.StreamOrderByWithRelationInput | Prisma.StreamOrderByWithRelationInput[];
    cursor?: Prisma.StreamWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StreamCountAggregateInputType;
    _avg?: StreamAvgAggregateInputType;
    _sum?: StreamSumAggregateInputType;
    _min?: StreamMinAggregateInputType;
    _max?: StreamMaxAggregateInputType;
};
export type GetStreamAggregateType<T extends StreamAggregateArgs> = {
    [P in keyof T & keyof AggregateStream]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStream[P]> : Prisma.GetScalarType<T[P], AggregateStream[P]>;
};
export type StreamGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StreamWhereInput;
    orderBy?: Prisma.StreamOrderByWithAggregationInput | Prisma.StreamOrderByWithAggregationInput[];
    by: Prisma.StreamScalarFieldEnum[] | Prisma.StreamScalarFieldEnum;
    having?: Prisma.StreamScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StreamCountAggregateInputType | true;
    _avg?: StreamAvgAggregateInputType;
    _sum?: StreamSumAggregateInputType;
    _min?: StreamMinAggregateInputType;
    _max?: StreamMaxAggregateInputType;
};
export type StreamGroupByOutputType = {
    id: number;
    uuid: string;
    start_time: Date;
    end_time: Date | null;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    title: string;
    description: string;
    status: $Enums.StreamStatus;
    removed: boolean;
    fileUrls: string[];
    thumbnailUrl: string | null;
    _count: StreamCountAggregateOutputType | null;
    _avg: StreamAvgAggregateOutputType | null;
    _sum: StreamSumAggregateOutputType | null;
    _min: StreamMinAggregateOutputType | null;
    _max: StreamMaxAggregateOutputType | null;
};
type GetStreamGroupByPayload<T extends StreamGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StreamGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StreamGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StreamGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StreamGroupByOutputType[P]>;
}>>;
export type StreamWhereInput = {
    AND?: Prisma.StreamWhereInput | Prisma.StreamWhereInput[];
    OR?: Prisma.StreamWhereInput[];
    NOT?: Prisma.StreamWhereInput | Prisma.StreamWhereInput[];
    id?: Prisma.IntFilter<"Stream"> | number;
    uuid?: Prisma.StringFilter<"Stream"> | string;
    start_time?: Prisma.DateTimeFilter<"Stream"> | Date | string;
    end_time?: Prisma.DateTimeNullableFilter<"Stream"> | Date | string | null;
    anon_id?: Prisma.StringFilter<"Stream"> | string;
    anon_text_color?: Prisma.StringFilter<"Stream"> | string;
    anon_background_color?: Prisma.StringFilter<"Stream"> | string;
    title?: Prisma.StringFilter<"Stream"> | string;
    description?: Prisma.StringFilter<"Stream"> | string;
    status?: Prisma.EnumStreamStatusFilter<"Stream"> | $Enums.StreamStatus;
    removed?: Prisma.BoolFilter<"Stream"> | boolean;
    fileUrls?: Prisma.StringNullableListFilter<"Stream">;
    thumbnailUrl?: Prisma.StringNullableFilter<"Stream"> | string | null;
    positions?: Prisma.StreamPositionListRelationFilter;
    chatMessages?: Prisma.ChatMessageListRelationFilter;
};
export type StreamOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    uuid?: Prisma.SortOrder;
    start_time?: Prisma.SortOrder;
    end_time?: Prisma.SortOrderInput | Prisma.SortOrder;
    anon_id?: Prisma.SortOrder;
    anon_text_color?: Prisma.SortOrder;
    anon_background_color?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    removed?: Prisma.SortOrder;
    fileUrls?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    positions?: Prisma.StreamPositionOrderByRelationAggregateInput;
    chatMessages?: Prisma.ChatMessageOrderByRelationAggregateInput;
};
export type StreamWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    uuid?: string;
    AND?: Prisma.StreamWhereInput | Prisma.StreamWhereInput[];
    OR?: Prisma.StreamWhereInput[];
    NOT?: Prisma.StreamWhereInput | Prisma.StreamWhereInput[];
    start_time?: Prisma.DateTimeFilter<"Stream"> | Date | string;
    end_time?: Prisma.DateTimeNullableFilter<"Stream"> | Date | string | null;
    anon_id?: Prisma.StringFilter<"Stream"> | string;
    anon_text_color?: Prisma.StringFilter<"Stream"> | string;
    anon_background_color?: Prisma.StringFilter<"Stream"> | string;
    title?: Prisma.StringFilter<"Stream"> | string;
    description?: Prisma.StringFilter<"Stream"> | string;
    status?: Prisma.EnumStreamStatusFilter<"Stream"> | $Enums.StreamStatus;
    removed?: Prisma.BoolFilter<"Stream"> | boolean;
    fileUrls?: Prisma.StringNullableListFilter<"Stream">;
    thumbnailUrl?: Prisma.StringNullableFilter<"Stream"> | string | null;
    positions?: Prisma.StreamPositionListRelationFilter;
    chatMessages?: Prisma.ChatMessageListRelationFilter;
}, "id" | "uuid">;
export type StreamOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    uuid?: Prisma.SortOrder;
    start_time?: Prisma.SortOrder;
    end_time?: Prisma.SortOrderInput | Prisma.SortOrder;
    anon_id?: Prisma.SortOrder;
    anon_text_color?: Prisma.SortOrder;
    anon_background_color?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    removed?: Prisma.SortOrder;
    fileUrls?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.StreamCountOrderByAggregateInput;
    _avg?: Prisma.StreamAvgOrderByAggregateInput;
    _max?: Prisma.StreamMaxOrderByAggregateInput;
    _min?: Prisma.StreamMinOrderByAggregateInput;
    _sum?: Prisma.StreamSumOrderByAggregateInput;
};
export type StreamScalarWhereWithAggregatesInput = {
    AND?: Prisma.StreamScalarWhereWithAggregatesInput | Prisma.StreamScalarWhereWithAggregatesInput[];
    OR?: Prisma.StreamScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StreamScalarWhereWithAggregatesInput | Prisma.StreamScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Stream"> | number;
    uuid?: Prisma.StringWithAggregatesFilter<"Stream"> | string;
    start_time?: Prisma.DateTimeWithAggregatesFilter<"Stream"> | Date | string;
    end_time?: Prisma.DateTimeNullableWithAggregatesFilter<"Stream"> | Date | string | null;
    anon_id?: Prisma.StringWithAggregatesFilter<"Stream"> | string;
    anon_text_color?: Prisma.StringWithAggregatesFilter<"Stream"> | string;
    anon_background_color?: Prisma.StringWithAggregatesFilter<"Stream"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Stream"> | string;
    description?: Prisma.StringWithAggregatesFilter<"Stream"> | string;
    status?: Prisma.EnumStreamStatusWithAggregatesFilter<"Stream"> | $Enums.StreamStatus;
    removed?: Prisma.BoolWithAggregatesFilter<"Stream"> | boolean;
    fileUrls?: Prisma.StringNullableListFilter<"Stream">;
    thumbnailUrl?: Prisma.StringNullableWithAggregatesFilter<"Stream"> | string | null;
};
export type StreamCreateInput = {
    uuid: string;
    start_time: Date | string;
    end_time?: Date | string | null;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    title: string;
    description: string;
    status: $Enums.StreamStatus;
    removed?: boolean;
    fileUrls?: Prisma.StreamCreatefileUrlsInput | string[];
    thumbnailUrl?: string | null;
    positions?: Prisma.StreamPositionCreateNestedManyWithoutStreamInput;
    chatMessages?: Prisma.ChatMessageCreateNestedManyWithoutStreamInput;
};
export type StreamUncheckedCreateInput = {
    id?: number;
    uuid: string;
    start_time: Date | string;
    end_time?: Date | string | null;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    title: string;
    description: string;
    status: $Enums.StreamStatus;
    removed?: boolean;
    fileUrls?: Prisma.StreamCreatefileUrlsInput | string[];
    thumbnailUrl?: string | null;
    positions?: Prisma.StreamPositionUncheckedCreateNestedManyWithoutStreamInput;
    chatMessages?: Prisma.ChatMessageUncheckedCreateNestedManyWithoutStreamInput;
};
export type StreamUpdateInput = {
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    start_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_time?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStreamStatusFieldUpdateOperationsInput | $Enums.StreamStatus;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fileUrls?: Prisma.StreamUpdatefileUrlsInput | string[];
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    positions?: Prisma.StreamPositionUpdateManyWithoutStreamNestedInput;
    chatMessages?: Prisma.ChatMessageUpdateManyWithoutStreamNestedInput;
};
export type StreamUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    start_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_time?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStreamStatusFieldUpdateOperationsInput | $Enums.StreamStatus;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fileUrls?: Prisma.StreamUpdatefileUrlsInput | string[];
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    positions?: Prisma.StreamPositionUncheckedUpdateManyWithoutStreamNestedInput;
    chatMessages?: Prisma.ChatMessageUncheckedUpdateManyWithoutStreamNestedInput;
};
export type StreamCreateManyInput = {
    id?: number;
    uuid: string;
    start_time: Date | string;
    end_time?: Date | string | null;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    title: string;
    description: string;
    status: $Enums.StreamStatus;
    removed?: boolean;
    fileUrls?: Prisma.StreamCreatefileUrlsInput | string[];
    thumbnailUrl?: string | null;
};
export type StreamUpdateManyMutationInput = {
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    start_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_time?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStreamStatusFieldUpdateOperationsInput | $Enums.StreamStatus;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fileUrls?: Prisma.StreamUpdatefileUrlsInput | string[];
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StreamUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    start_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_time?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStreamStatusFieldUpdateOperationsInput | $Enums.StreamStatus;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fileUrls?: Prisma.StreamUpdatefileUrlsInput | string[];
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
};
export type StreamCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    uuid?: Prisma.SortOrder;
    start_time?: Prisma.SortOrder;
    end_time?: Prisma.SortOrder;
    anon_id?: Prisma.SortOrder;
    anon_text_color?: Prisma.SortOrder;
    anon_background_color?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    removed?: Prisma.SortOrder;
    fileUrls?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrder;
};
export type StreamAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type StreamMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    uuid?: Prisma.SortOrder;
    start_time?: Prisma.SortOrder;
    end_time?: Prisma.SortOrder;
    anon_id?: Prisma.SortOrder;
    anon_text_color?: Prisma.SortOrder;
    anon_background_color?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    removed?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrder;
};
export type StreamMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    uuid?: Prisma.SortOrder;
    start_time?: Prisma.SortOrder;
    end_time?: Prisma.SortOrder;
    anon_id?: Prisma.SortOrder;
    anon_text_color?: Prisma.SortOrder;
    anon_background_color?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    removed?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrder;
};
export type StreamSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type StreamScalarRelationFilter = {
    is?: Prisma.StreamWhereInput;
    isNot?: Prisma.StreamWhereInput;
};
export type StreamCreatefileUrlsInput = {
    set: string[];
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type EnumStreamStatusFieldUpdateOperationsInput = {
    set?: $Enums.StreamStatus;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type StreamUpdatefileUrlsInput = {
    set?: string[];
    push?: string | string[];
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type StreamCreateNestedOneWithoutPositionsInput = {
    create?: Prisma.XOR<Prisma.StreamCreateWithoutPositionsInput, Prisma.StreamUncheckedCreateWithoutPositionsInput>;
    connectOrCreate?: Prisma.StreamCreateOrConnectWithoutPositionsInput;
    connect?: Prisma.StreamWhereUniqueInput;
};
export type StreamUpdateOneRequiredWithoutPositionsNestedInput = {
    create?: Prisma.XOR<Prisma.StreamCreateWithoutPositionsInput, Prisma.StreamUncheckedCreateWithoutPositionsInput>;
    connectOrCreate?: Prisma.StreamCreateOrConnectWithoutPositionsInput;
    upsert?: Prisma.StreamUpsertWithoutPositionsInput;
    connect?: Prisma.StreamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StreamUpdateToOneWithWhereWithoutPositionsInput, Prisma.StreamUpdateWithoutPositionsInput>, Prisma.StreamUncheckedUpdateWithoutPositionsInput>;
};
export type StreamCreateNestedOneWithoutChatMessagesInput = {
    create?: Prisma.XOR<Prisma.StreamCreateWithoutChatMessagesInput, Prisma.StreamUncheckedCreateWithoutChatMessagesInput>;
    connectOrCreate?: Prisma.StreamCreateOrConnectWithoutChatMessagesInput;
    connect?: Prisma.StreamWhereUniqueInput;
};
export type StreamUpdateOneRequiredWithoutChatMessagesNestedInput = {
    create?: Prisma.XOR<Prisma.StreamCreateWithoutChatMessagesInput, Prisma.StreamUncheckedCreateWithoutChatMessagesInput>;
    connectOrCreate?: Prisma.StreamCreateOrConnectWithoutChatMessagesInput;
    upsert?: Prisma.StreamUpsertWithoutChatMessagesInput;
    connect?: Prisma.StreamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StreamUpdateToOneWithWhereWithoutChatMessagesInput, Prisma.StreamUpdateWithoutChatMessagesInput>, Prisma.StreamUncheckedUpdateWithoutChatMessagesInput>;
};
export type StreamCreateWithoutPositionsInput = {
    uuid: string;
    start_time: Date | string;
    end_time?: Date | string | null;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    title: string;
    description: string;
    status: $Enums.StreamStatus;
    removed?: boolean;
    fileUrls?: Prisma.StreamCreatefileUrlsInput | string[];
    thumbnailUrl?: string | null;
    chatMessages?: Prisma.ChatMessageCreateNestedManyWithoutStreamInput;
};
export type StreamUncheckedCreateWithoutPositionsInput = {
    id?: number;
    uuid: string;
    start_time: Date | string;
    end_time?: Date | string | null;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    title: string;
    description: string;
    status: $Enums.StreamStatus;
    removed?: boolean;
    fileUrls?: Prisma.StreamCreatefileUrlsInput | string[];
    thumbnailUrl?: string | null;
    chatMessages?: Prisma.ChatMessageUncheckedCreateNestedManyWithoutStreamInput;
};
export type StreamCreateOrConnectWithoutPositionsInput = {
    where: Prisma.StreamWhereUniqueInput;
    create: Prisma.XOR<Prisma.StreamCreateWithoutPositionsInput, Prisma.StreamUncheckedCreateWithoutPositionsInput>;
};
export type StreamUpsertWithoutPositionsInput = {
    update: Prisma.XOR<Prisma.StreamUpdateWithoutPositionsInput, Prisma.StreamUncheckedUpdateWithoutPositionsInput>;
    create: Prisma.XOR<Prisma.StreamCreateWithoutPositionsInput, Prisma.StreamUncheckedCreateWithoutPositionsInput>;
    where?: Prisma.StreamWhereInput;
};
export type StreamUpdateToOneWithWhereWithoutPositionsInput = {
    where?: Prisma.StreamWhereInput;
    data: Prisma.XOR<Prisma.StreamUpdateWithoutPositionsInput, Prisma.StreamUncheckedUpdateWithoutPositionsInput>;
};
export type StreamUpdateWithoutPositionsInput = {
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    start_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_time?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStreamStatusFieldUpdateOperationsInput | $Enums.StreamStatus;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fileUrls?: Prisma.StreamUpdatefileUrlsInput | string[];
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    chatMessages?: Prisma.ChatMessageUpdateManyWithoutStreamNestedInput;
};
export type StreamUncheckedUpdateWithoutPositionsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    start_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_time?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStreamStatusFieldUpdateOperationsInput | $Enums.StreamStatus;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fileUrls?: Prisma.StreamUpdatefileUrlsInput | string[];
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    chatMessages?: Prisma.ChatMessageUncheckedUpdateManyWithoutStreamNestedInput;
};
export type StreamCreateWithoutChatMessagesInput = {
    uuid: string;
    start_time: Date | string;
    end_time?: Date | string | null;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    title: string;
    description: string;
    status: $Enums.StreamStatus;
    removed?: boolean;
    fileUrls?: Prisma.StreamCreatefileUrlsInput | string[];
    thumbnailUrl?: string | null;
    positions?: Prisma.StreamPositionCreateNestedManyWithoutStreamInput;
};
export type StreamUncheckedCreateWithoutChatMessagesInput = {
    id?: number;
    uuid: string;
    start_time: Date | string;
    end_time?: Date | string | null;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    title: string;
    description: string;
    status: $Enums.StreamStatus;
    removed?: boolean;
    fileUrls?: Prisma.StreamCreatefileUrlsInput | string[];
    thumbnailUrl?: string | null;
    positions?: Prisma.StreamPositionUncheckedCreateNestedManyWithoutStreamInput;
};
export type StreamCreateOrConnectWithoutChatMessagesInput = {
    where: Prisma.StreamWhereUniqueInput;
    create: Prisma.XOR<Prisma.StreamCreateWithoutChatMessagesInput, Prisma.StreamUncheckedCreateWithoutChatMessagesInput>;
};
export type StreamUpsertWithoutChatMessagesInput = {
    update: Prisma.XOR<Prisma.StreamUpdateWithoutChatMessagesInput, Prisma.StreamUncheckedUpdateWithoutChatMessagesInput>;
    create: Prisma.XOR<Prisma.StreamCreateWithoutChatMessagesInput, Prisma.StreamUncheckedCreateWithoutChatMessagesInput>;
    where?: Prisma.StreamWhereInput;
};
export type StreamUpdateToOneWithWhereWithoutChatMessagesInput = {
    where?: Prisma.StreamWhereInput;
    data: Prisma.XOR<Prisma.StreamUpdateWithoutChatMessagesInput, Prisma.StreamUncheckedUpdateWithoutChatMessagesInput>;
};
export type StreamUpdateWithoutChatMessagesInput = {
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    start_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_time?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStreamStatusFieldUpdateOperationsInput | $Enums.StreamStatus;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fileUrls?: Prisma.StreamUpdatefileUrlsInput | string[];
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    positions?: Prisma.StreamPositionUpdateManyWithoutStreamNestedInput;
};
export type StreamUncheckedUpdateWithoutChatMessagesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    start_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_time?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStreamStatusFieldUpdateOperationsInput | $Enums.StreamStatus;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    fileUrls?: Prisma.StreamUpdatefileUrlsInput | string[];
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    positions?: Prisma.StreamPositionUncheckedUpdateManyWithoutStreamNestedInput;
};
export type StreamCountOutputType = {
    positions: number;
    chatMessages: number;
};
export type StreamCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    positions?: boolean | StreamCountOutputTypeCountPositionsArgs;
    chatMessages?: boolean | StreamCountOutputTypeCountChatMessagesArgs;
};
export type StreamCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamCountOutputTypeSelect<ExtArgs> | null;
};
export type StreamCountOutputTypeCountPositionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StreamPositionWhereInput;
};
export type StreamCountOutputTypeCountChatMessagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChatMessageWhereInput;
};
export type StreamSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    uuid?: boolean;
    start_time?: boolean;
    end_time?: boolean;
    anon_id?: boolean;
    anon_text_color?: boolean;
    anon_background_color?: boolean;
    title?: boolean;
    description?: boolean;
    status?: boolean;
    removed?: boolean;
    fileUrls?: boolean;
    thumbnailUrl?: boolean;
    positions?: boolean | Prisma.Stream$positionsArgs<ExtArgs>;
    chatMessages?: boolean | Prisma.Stream$chatMessagesArgs<ExtArgs>;
    _count?: boolean | Prisma.StreamCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stream"]>;
export type StreamSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    uuid?: boolean;
    start_time?: boolean;
    end_time?: boolean;
    anon_id?: boolean;
    anon_text_color?: boolean;
    anon_background_color?: boolean;
    title?: boolean;
    description?: boolean;
    status?: boolean;
    removed?: boolean;
    fileUrls?: boolean;
    thumbnailUrl?: boolean;
}, ExtArgs["result"]["stream"]>;
export type StreamSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    uuid?: boolean;
    start_time?: boolean;
    end_time?: boolean;
    anon_id?: boolean;
    anon_text_color?: boolean;
    anon_background_color?: boolean;
    title?: boolean;
    description?: boolean;
    status?: boolean;
    removed?: boolean;
    fileUrls?: boolean;
    thumbnailUrl?: boolean;
}, ExtArgs["result"]["stream"]>;
export type StreamSelectScalar = {
    id?: boolean;
    uuid?: boolean;
    start_time?: boolean;
    end_time?: boolean;
    anon_id?: boolean;
    anon_text_color?: boolean;
    anon_background_color?: boolean;
    title?: boolean;
    description?: boolean;
    status?: boolean;
    removed?: boolean;
    fileUrls?: boolean;
    thumbnailUrl?: boolean;
};
export type StreamOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "uuid" | "start_time" | "end_time" | "anon_id" | "anon_text_color" | "anon_background_color" | "title" | "description" | "status" | "removed" | "fileUrls" | "thumbnailUrl", ExtArgs["result"]["stream"]>;
export type StreamInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    positions?: boolean | Prisma.Stream$positionsArgs<ExtArgs>;
    chatMessages?: boolean | Prisma.Stream$chatMessagesArgs<ExtArgs>;
    _count?: boolean | Prisma.StreamCountOutputTypeDefaultArgs<ExtArgs>;
};
export type StreamIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type StreamIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $StreamPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Stream";
    objects: {
        positions: Prisma.$StreamPositionPayload<ExtArgs>[];
        chatMessages: Prisma.$ChatMessagePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        uuid: string;
        start_time: Date;
        end_time: Date | null;
        anon_id: string;
        anon_text_color: string;
        anon_background_color: string;
        title: string;
        description: string;
        status: $Enums.StreamStatus;
        removed: boolean;
        fileUrls: string[];
        thumbnailUrl: string | null;
    }, ExtArgs["result"]["stream"]>;
    composites: {};
};
export type StreamGetPayload<S extends boolean | null | undefined | StreamDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StreamPayload, S>;
export type StreamCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StreamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StreamCountAggregateInputType | true;
};
export interface StreamDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Stream'];
        meta: {
            name: 'Stream';
        };
    };
    findUnique<T extends StreamFindUniqueArgs>(args: Prisma.SelectSubset<T, StreamFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StreamClient<runtime.Types.Result.GetResult<Prisma.$StreamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StreamFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StreamFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StreamClient<runtime.Types.Result.GetResult<Prisma.$StreamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StreamFindFirstArgs>(args?: Prisma.SelectSubset<T, StreamFindFirstArgs<ExtArgs>>): Prisma.Prisma__StreamClient<runtime.Types.Result.GetResult<Prisma.$StreamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StreamFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StreamFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StreamClient<runtime.Types.Result.GetResult<Prisma.$StreamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StreamFindManyArgs>(args?: Prisma.SelectSubset<T, StreamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StreamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StreamCreateArgs>(args: Prisma.SelectSubset<T, StreamCreateArgs<ExtArgs>>): Prisma.Prisma__StreamClient<runtime.Types.Result.GetResult<Prisma.$StreamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StreamCreateManyArgs>(args?: Prisma.SelectSubset<T, StreamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StreamCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StreamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StreamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StreamDeleteArgs>(args: Prisma.SelectSubset<T, StreamDeleteArgs<ExtArgs>>): Prisma.Prisma__StreamClient<runtime.Types.Result.GetResult<Prisma.$StreamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StreamUpdateArgs>(args: Prisma.SelectSubset<T, StreamUpdateArgs<ExtArgs>>): Prisma.Prisma__StreamClient<runtime.Types.Result.GetResult<Prisma.$StreamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StreamDeleteManyArgs>(args?: Prisma.SelectSubset<T, StreamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StreamUpdateManyArgs>(args: Prisma.SelectSubset<T, StreamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StreamUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StreamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StreamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StreamUpsertArgs>(args: Prisma.SelectSubset<T, StreamUpsertArgs<ExtArgs>>): Prisma.Prisma__StreamClient<runtime.Types.Result.GetResult<Prisma.$StreamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StreamCountArgs>(args?: Prisma.Subset<T, StreamCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StreamCountAggregateOutputType> : number>;
    aggregate<T extends StreamAggregateArgs>(args: Prisma.Subset<T, StreamAggregateArgs>): Prisma.PrismaPromise<GetStreamAggregateType<T>>;
    groupBy<T extends StreamGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StreamGroupByArgs['orderBy'];
    } : {
        orderBy?: StreamGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StreamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStreamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StreamFieldRefs;
}
export interface Prisma__StreamClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    positions<T extends Prisma.Stream$positionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Stream$positionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StreamPositionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    chatMessages<T extends Prisma.Stream$chatMessagesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Stream$chatMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StreamFieldRefs {
    readonly id: Prisma.FieldRef<"Stream", 'Int'>;
    readonly uuid: Prisma.FieldRef<"Stream", 'String'>;
    readonly start_time: Prisma.FieldRef<"Stream", 'DateTime'>;
    readonly end_time: Prisma.FieldRef<"Stream", 'DateTime'>;
    readonly anon_id: Prisma.FieldRef<"Stream", 'String'>;
    readonly anon_text_color: Prisma.FieldRef<"Stream", 'String'>;
    readonly anon_background_color: Prisma.FieldRef<"Stream", 'String'>;
    readonly title: Prisma.FieldRef<"Stream", 'String'>;
    readonly description: Prisma.FieldRef<"Stream", 'String'>;
    readonly status: Prisma.FieldRef<"Stream", 'StreamStatus'>;
    readonly removed: Prisma.FieldRef<"Stream", 'Boolean'>;
    readonly fileUrls: Prisma.FieldRef<"Stream", 'String[]'>;
    readonly thumbnailUrl: Prisma.FieldRef<"Stream", 'String'>;
}
export type StreamFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamSelect<ExtArgs> | null;
    omit?: Prisma.StreamOmit<ExtArgs> | null;
    include?: Prisma.StreamInclude<ExtArgs> | null;
    where: Prisma.StreamWhereUniqueInput;
};
export type StreamFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamSelect<ExtArgs> | null;
    omit?: Prisma.StreamOmit<ExtArgs> | null;
    include?: Prisma.StreamInclude<ExtArgs> | null;
    where: Prisma.StreamWhereUniqueInput;
};
export type StreamFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamSelect<ExtArgs> | null;
    omit?: Prisma.StreamOmit<ExtArgs> | null;
    include?: Prisma.StreamInclude<ExtArgs> | null;
    where?: Prisma.StreamWhereInput;
    orderBy?: Prisma.StreamOrderByWithRelationInput | Prisma.StreamOrderByWithRelationInput[];
    cursor?: Prisma.StreamWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StreamScalarFieldEnum | Prisma.StreamScalarFieldEnum[];
};
export type StreamFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamSelect<ExtArgs> | null;
    omit?: Prisma.StreamOmit<ExtArgs> | null;
    include?: Prisma.StreamInclude<ExtArgs> | null;
    where?: Prisma.StreamWhereInput;
    orderBy?: Prisma.StreamOrderByWithRelationInput | Prisma.StreamOrderByWithRelationInput[];
    cursor?: Prisma.StreamWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StreamScalarFieldEnum | Prisma.StreamScalarFieldEnum[];
};
export type StreamFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamSelect<ExtArgs> | null;
    omit?: Prisma.StreamOmit<ExtArgs> | null;
    include?: Prisma.StreamInclude<ExtArgs> | null;
    where?: Prisma.StreamWhereInput;
    orderBy?: Prisma.StreamOrderByWithRelationInput | Prisma.StreamOrderByWithRelationInput[];
    cursor?: Prisma.StreamWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StreamScalarFieldEnum | Prisma.StreamScalarFieldEnum[];
};
export type StreamCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamSelect<ExtArgs> | null;
    omit?: Prisma.StreamOmit<ExtArgs> | null;
    include?: Prisma.StreamInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StreamCreateInput, Prisma.StreamUncheckedCreateInput>;
};
export type StreamCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StreamCreateManyInput | Prisma.StreamCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StreamCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StreamOmit<ExtArgs> | null;
    data: Prisma.StreamCreateManyInput | Prisma.StreamCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StreamUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamSelect<ExtArgs> | null;
    omit?: Prisma.StreamOmit<ExtArgs> | null;
    include?: Prisma.StreamInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StreamUpdateInput, Prisma.StreamUncheckedUpdateInput>;
    where: Prisma.StreamWhereUniqueInput;
};
export type StreamUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StreamUpdateManyMutationInput, Prisma.StreamUncheckedUpdateManyInput>;
    where?: Prisma.StreamWhereInput;
    limit?: number;
};
export type StreamUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StreamOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StreamUpdateManyMutationInput, Prisma.StreamUncheckedUpdateManyInput>;
    where?: Prisma.StreamWhereInput;
    limit?: number;
};
export type StreamUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamSelect<ExtArgs> | null;
    omit?: Prisma.StreamOmit<ExtArgs> | null;
    include?: Prisma.StreamInclude<ExtArgs> | null;
    where: Prisma.StreamWhereUniqueInput;
    create: Prisma.XOR<Prisma.StreamCreateInput, Prisma.StreamUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StreamUpdateInput, Prisma.StreamUncheckedUpdateInput>;
};
export type StreamDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamSelect<ExtArgs> | null;
    omit?: Prisma.StreamOmit<ExtArgs> | null;
    include?: Prisma.StreamInclude<ExtArgs> | null;
    where: Prisma.StreamWhereUniqueInput;
};
export type StreamDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StreamWhereInput;
    limit?: number;
};
export type Stream$positionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamPositionSelect<ExtArgs> | null;
    omit?: Prisma.StreamPositionOmit<ExtArgs> | null;
    include?: Prisma.StreamPositionInclude<ExtArgs> | null;
    where?: Prisma.StreamPositionWhereInput;
    orderBy?: Prisma.StreamPositionOrderByWithRelationInput | Prisma.StreamPositionOrderByWithRelationInput[];
    cursor?: Prisma.StreamPositionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StreamPositionScalarFieldEnum | Prisma.StreamPositionScalarFieldEnum[];
};
export type Stream$chatMessagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    where?: Prisma.ChatMessageWhereInput;
    orderBy?: Prisma.ChatMessageOrderByWithRelationInput | Prisma.ChatMessageOrderByWithRelationInput[];
    cursor?: Prisma.ChatMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChatMessageScalarFieldEnum | Prisma.ChatMessageScalarFieldEnum[];
};
export type StreamDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamSelect<ExtArgs> | null;
    omit?: Prisma.StreamOmit<ExtArgs> | null;
    include?: Prisma.StreamInclude<ExtArgs> | null;
};
export {};
