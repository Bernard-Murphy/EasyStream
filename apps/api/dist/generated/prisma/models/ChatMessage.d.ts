import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ChatMessageModel = runtime.Types.Result.DefaultSelection<Prisma.$ChatMessagePayload>;
export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null;
    _avg: ChatMessageAvgAggregateOutputType | null;
    _sum: ChatMessageSumAggregateOutputType | null;
    _min: ChatMessageMinAggregateOutputType | null;
    _max: ChatMessageMaxAggregateOutputType | null;
};
export type ChatMessageAvgAggregateOutputType = {
    id: number | null;
    stream_id: number | null;
};
export type ChatMessageSumAggregateOutputType = {
    id: number | null;
    stream_id: number | null;
};
export type ChatMessageMinAggregateOutputType = {
    id: number | null;
    uuid: string | null;
    create_date: Date | null;
    anon_id: string | null;
    anon_text_color: string | null;
    anon_background_color: string | null;
    name: string | null;
    message: string | null;
    removed: boolean | null;
    stream_id: number | null;
};
export type ChatMessageMaxAggregateOutputType = {
    id: number | null;
    uuid: string | null;
    create_date: Date | null;
    anon_id: string | null;
    anon_text_color: string | null;
    anon_background_color: string | null;
    name: string | null;
    message: string | null;
    removed: boolean | null;
    stream_id: number | null;
};
export type ChatMessageCountAggregateOutputType = {
    id: number;
    uuid: number;
    create_date: number;
    anon_id: number;
    anon_text_color: number;
    anon_background_color: number;
    name: number;
    message: number;
    removed: number;
    stream_id: number;
    _all: number;
};
export type ChatMessageAvgAggregateInputType = {
    id?: true;
    stream_id?: true;
};
export type ChatMessageSumAggregateInputType = {
    id?: true;
    stream_id?: true;
};
export type ChatMessageMinAggregateInputType = {
    id?: true;
    uuid?: true;
    create_date?: true;
    anon_id?: true;
    anon_text_color?: true;
    anon_background_color?: true;
    name?: true;
    message?: true;
    removed?: true;
    stream_id?: true;
};
export type ChatMessageMaxAggregateInputType = {
    id?: true;
    uuid?: true;
    create_date?: true;
    anon_id?: true;
    anon_text_color?: true;
    anon_background_color?: true;
    name?: true;
    message?: true;
    removed?: true;
    stream_id?: true;
};
export type ChatMessageCountAggregateInputType = {
    id?: true;
    uuid?: true;
    create_date?: true;
    anon_id?: true;
    anon_text_color?: true;
    anon_background_color?: true;
    name?: true;
    message?: true;
    removed?: true;
    stream_id?: true;
    _all?: true;
};
export type ChatMessageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChatMessageWhereInput;
    orderBy?: Prisma.ChatMessageOrderByWithRelationInput | Prisma.ChatMessageOrderByWithRelationInput[];
    cursor?: Prisma.ChatMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ChatMessageCountAggregateInputType;
    _avg?: ChatMessageAvgAggregateInputType;
    _sum?: ChatMessageSumAggregateInputType;
    _min?: ChatMessageMinAggregateInputType;
    _max?: ChatMessageMaxAggregateInputType;
};
export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
    [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateChatMessage[P]> : Prisma.GetScalarType<T[P], AggregateChatMessage[P]>;
};
export type ChatMessageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChatMessageWhereInput;
    orderBy?: Prisma.ChatMessageOrderByWithAggregationInput | Prisma.ChatMessageOrderByWithAggregationInput[];
    by: Prisma.ChatMessageScalarFieldEnum[] | Prisma.ChatMessageScalarFieldEnum;
    having?: Prisma.ChatMessageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ChatMessageCountAggregateInputType | true;
    _avg?: ChatMessageAvgAggregateInputType;
    _sum?: ChatMessageSumAggregateInputType;
    _min?: ChatMessageMinAggregateInputType;
    _max?: ChatMessageMaxAggregateInputType;
};
export type ChatMessageGroupByOutputType = {
    id: number;
    uuid: string;
    create_date: Date;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    name: string | null;
    message: string;
    removed: boolean;
    stream_id: number;
    _count: ChatMessageCountAggregateOutputType | null;
    _avg: ChatMessageAvgAggregateOutputType | null;
    _sum: ChatMessageSumAggregateOutputType | null;
    _min: ChatMessageMinAggregateOutputType | null;
    _max: ChatMessageMaxAggregateOutputType | null;
};
type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ChatMessageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ChatMessageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ChatMessageGroupByOutputType[P]>;
}>>;
export type ChatMessageWhereInput = {
    AND?: Prisma.ChatMessageWhereInput | Prisma.ChatMessageWhereInput[];
    OR?: Prisma.ChatMessageWhereInput[];
    NOT?: Prisma.ChatMessageWhereInput | Prisma.ChatMessageWhereInput[];
    id?: Prisma.IntFilter<"ChatMessage"> | number;
    uuid?: Prisma.StringFilter<"ChatMessage"> | string;
    create_date?: Prisma.DateTimeFilter<"ChatMessage"> | Date | string;
    anon_id?: Prisma.StringFilter<"ChatMessage"> | string;
    anon_text_color?: Prisma.StringFilter<"ChatMessage"> | string;
    anon_background_color?: Prisma.StringFilter<"ChatMessage"> | string;
    name?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    message?: Prisma.StringFilter<"ChatMessage"> | string;
    removed?: Prisma.BoolFilter<"ChatMessage"> | boolean;
    stream_id?: Prisma.IntFilter<"ChatMessage"> | number;
    stream?: Prisma.XOR<Prisma.StreamScalarRelationFilter, Prisma.StreamWhereInput>;
};
export type ChatMessageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    uuid?: Prisma.SortOrder;
    create_date?: Prisma.SortOrder;
    anon_id?: Prisma.SortOrder;
    anon_text_color?: Prisma.SortOrder;
    anon_background_color?: Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    message?: Prisma.SortOrder;
    removed?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
    stream?: Prisma.StreamOrderByWithRelationInput;
};
export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    uuid?: string;
    AND?: Prisma.ChatMessageWhereInput | Prisma.ChatMessageWhereInput[];
    OR?: Prisma.ChatMessageWhereInput[];
    NOT?: Prisma.ChatMessageWhereInput | Prisma.ChatMessageWhereInput[];
    create_date?: Prisma.DateTimeFilter<"ChatMessage"> | Date | string;
    anon_id?: Prisma.StringFilter<"ChatMessage"> | string;
    anon_text_color?: Prisma.StringFilter<"ChatMessage"> | string;
    anon_background_color?: Prisma.StringFilter<"ChatMessage"> | string;
    name?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    message?: Prisma.StringFilter<"ChatMessage"> | string;
    removed?: Prisma.BoolFilter<"ChatMessage"> | boolean;
    stream_id?: Prisma.IntFilter<"ChatMessage"> | number;
    stream?: Prisma.XOR<Prisma.StreamScalarRelationFilter, Prisma.StreamWhereInput>;
}, "id" | "uuid">;
export type ChatMessageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    uuid?: Prisma.SortOrder;
    create_date?: Prisma.SortOrder;
    anon_id?: Prisma.SortOrder;
    anon_text_color?: Prisma.SortOrder;
    anon_background_color?: Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    message?: Prisma.SortOrder;
    removed?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
    _count?: Prisma.ChatMessageCountOrderByAggregateInput;
    _avg?: Prisma.ChatMessageAvgOrderByAggregateInput;
    _max?: Prisma.ChatMessageMaxOrderByAggregateInput;
    _min?: Prisma.ChatMessageMinOrderByAggregateInput;
    _sum?: Prisma.ChatMessageSumOrderByAggregateInput;
};
export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: Prisma.ChatMessageScalarWhereWithAggregatesInput | Prisma.ChatMessageScalarWhereWithAggregatesInput[];
    OR?: Prisma.ChatMessageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ChatMessageScalarWhereWithAggregatesInput | Prisma.ChatMessageScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"ChatMessage"> | number;
    uuid?: Prisma.StringWithAggregatesFilter<"ChatMessage"> | string;
    create_date?: Prisma.DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string;
    anon_id?: Prisma.StringWithAggregatesFilter<"ChatMessage"> | string;
    anon_text_color?: Prisma.StringWithAggregatesFilter<"ChatMessage"> | string;
    anon_background_color?: Prisma.StringWithAggregatesFilter<"ChatMessage"> | string;
    name?: Prisma.StringNullableWithAggregatesFilter<"ChatMessage"> | string | null;
    message?: Prisma.StringWithAggregatesFilter<"ChatMessage"> | string;
    removed?: Prisma.BoolWithAggregatesFilter<"ChatMessage"> | boolean;
    stream_id?: Prisma.IntWithAggregatesFilter<"ChatMessage"> | number;
};
export type ChatMessageCreateInput = {
    uuid: string;
    create_date?: Date | string;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    name?: string | null;
    message: string;
    removed?: boolean;
    stream: Prisma.StreamCreateNestedOneWithoutChatMessagesInput;
};
export type ChatMessageUncheckedCreateInput = {
    id?: number;
    uuid: string;
    create_date?: Date | string;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    name?: string | null;
    message: string;
    removed?: boolean;
    stream_id: number;
};
export type ChatMessageUpdateInput = {
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    create_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    stream?: Prisma.StreamUpdateOneRequiredWithoutChatMessagesNestedInput;
};
export type ChatMessageUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    create_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    stream_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type ChatMessageCreateManyInput = {
    id?: number;
    uuid: string;
    create_date?: Date | string;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    name?: string | null;
    message: string;
    removed?: boolean;
    stream_id: number;
};
export type ChatMessageUpdateManyMutationInput = {
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    create_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ChatMessageUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    create_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    stream_id?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type ChatMessageListRelationFilter = {
    every?: Prisma.ChatMessageWhereInput;
    some?: Prisma.ChatMessageWhereInput;
    none?: Prisma.ChatMessageWhereInput;
};
export type ChatMessageOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ChatMessageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    uuid?: Prisma.SortOrder;
    create_date?: Prisma.SortOrder;
    anon_id?: Prisma.SortOrder;
    anon_text_color?: Prisma.SortOrder;
    anon_background_color?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    removed?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
};
export type ChatMessageAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
};
export type ChatMessageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    uuid?: Prisma.SortOrder;
    create_date?: Prisma.SortOrder;
    anon_id?: Prisma.SortOrder;
    anon_text_color?: Prisma.SortOrder;
    anon_background_color?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    removed?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
};
export type ChatMessageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    uuid?: Prisma.SortOrder;
    create_date?: Prisma.SortOrder;
    anon_id?: Prisma.SortOrder;
    anon_text_color?: Prisma.SortOrder;
    anon_background_color?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    removed?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
};
export type ChatMessageSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
};
export type ChatMessageCreateNestedManyWithoutStreamInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutStreamInput, Prisma.ChatMessageUncheckedCreateWithoutStreamInput> | Prisma.ChatMessageCreateWithoutStreamInput[] | Prisma.ChatMessageUncheckedCreateWithoutStreamInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutStreamInput | Prisma.ChatMessageCreateOrConnectWithoutStreamInput[];
    createMany?: Prisma.ChatMessageCreateManyStreamInputEnvelope;
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
};
export type ChatMessageUncheckedCreateNestedManyWithoutStreamInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutStreamInput, Prisma.ChatMessageUncheckedCreateWithoutStreamInput> | Prisma.ChatMessageCreateWithoutStreamInput[] | Prisma.ChatMessageUncheckedCreateWithoutStreamInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutStreamInput | Prisma.ChatMessageCreateOrConnectWithoutStreamInput[];
    createMany?: Prisma.ChatMessageCreateManyStreamInputEnvelope;
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
};
export type ChatMessageUpdateManyWithoutStreamNestedInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutStreamInput, Prisma.ChatMessageUncheckedCreateWithoutStreamInput> | Prisma.ChatMessageCreateWithoutStreamInput[] | Prisma.ChatMessageUncheckedCreateWithoutStreamInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutStreamInput | Prisma.ChatMessageCreateOrConnectWithoutStreamInput[];
    upsert?: Prisma.ChatMessageUpsertWithWhereUniqueWithoutStreamInput | Prisma.ChatMessageUpsertWithWhereUniqueWithoutStreamInput[];
    createMany?: Prisma.ChatMessageCreateManyStreamInputEnvelope;
    set?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    disconnect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    delete?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    update?: Prisma.ChatMessageUpdateWithWhereUniqueWithoutStreamInput | Prisma.ChatMessageUpdateWithWhereUniqueWithoutStreamInput[];
    updateMany?: Prisma.ChatMessageUpdateManyWithWhereWithoutStreamInput | Prisma.ChatMessageUpdateManyWithWhereWithoutStreamInput[];
    deleteMany?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
};
export type ChatMessageUncheckedUpdateManyWithoutStreamNestedInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutStreamInput, Prisma.ChatMessageUncheckedCreateWithoutStreamInput> | Prisma.ChatMessageCreateWithoutStreamInput[] | Prisma.ChatMessageUncheckedCreateWithoutStreamInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutStreamInput | Prisma.ChatMessageCreateOrConnectWithoutStreamInput[];
    upsert?: Prisma.ChatMessageUpsertWithWhereUniqueWithoutStreamInput | Prisma.ChatMessageUpsertWithWhereUniqueWithoutStreamInput[];
    createMany?: Prisma.ChatMessageCreateManyStreamInputEnvelope;
    set?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    disconnect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    delete?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    update?: Prisma.ChatMessageUpdateWithWhereUniqueWithoutStreamInput | Prisma.ChatMessageUpdateWithWhereUniqueWithoutStreamInput[];
    updateMany?: Prisma.ChatMessageUpdateManyWithWhereWithoutStreamInput | Prisma.ChatMessageUpdateManyWithWhereWithoutStreamInput[];
    deleteMany?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
};
export type ChatMessageCreateWithoutStreamInput = {
    uuid: string;
    create_date?: Date | string;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    name?: string | null;
    message: string;
    removed?: boolean;
};
export type ChatMessageUncheckedCreateWithoutStreamInput = {
    id?: number;
    uuid: string;
    create_date?: Date | string;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    name?: string | null;
    message: string;
    removed?: boolean;
};
export type ChatMessageCreateOrConnectWithoutStreamInput = {
    where: Prisma.ChatMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChatMessageCreateWithoutStreamInput, Prisma.ChatMessageUncheckedCreateWithoutStreamInput>;
};
export type ChatMessageCreateManyStreamInputEnvelope = {
    data: Prisma.ChatMessageCreateManyStreamInput | Prisma.ChatMessageCreateManyStreamInput[];
    skipDuplicates?: boolean;
};
export type ChatMessageUpsertWithWhereUniqueWithoutStreamInput = {
    where: Prisma.ChatMessageWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChatMessageUpdateWithoutStreamInput, Prisma.ChatMessageUncheckedUpdateWithoutStreamInput>;
    create: Prisma.XOR<Prisma.ChatMessageCreateWithoutStreamInput, Prisma.ChatMessageUncheckedCreateWithoutStreamInput>;
};
export type ChatMessageUpdateWithWhereUniqueWithoutStreamInput = {
    where: Prisma.ChatMessageWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChatMessageUpdateWithoutStreamInput, Prisma.ChatMessageUncheckedUpdateWithoutStreamInput>;
};
export type ChatMessageUpdateManyWithWhereWithoutStreamInput = {
    where: Prisma.ChatMessageScalarWhereInput;
    data: Prisma.XOR<Prisma.ChatMessageUpdateManyMutationInput, Prisma.ChatMessageUncheckedUpdateManyWithoutStreamInput>;
};
export type ChatMessageScalarWhereInput = {
    AND?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
    OR?: Prisma.ChatMessageScalarWhereInput[];
    NOT?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
    id?: Prisma.IntFilter<"ChatMessage"> | number;
    uuid?: Prisma.StringFilter<"ChatMessage"> | string;
    create_date?: Prisma.DateTimeFilter<"ChatMessage"> | Date | string;
    anon_id?: Prisma.StringFilter<"ChatMessage"> | string;
    anon_text_color?: Prisma.StringFilter<"ChatMessage"> | string;
    anon_background_color?: Prisma.StringFilter<"ChatMessage"> | string;
    name?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    message?: Prisma.StringFilter<"ChatMessage"> | string;
    removed?: Prisma.BoolFilter<"ChatMessage"> | boolean;
    stream_id?: Prisma.IntFilter<"ChatMessage"> | number;
};
export type ChatMessageCreateManyStreamInput = {
    id?: number;
    uuid: string;
    create_date?: Date | string;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    name?: string | null;
    message: string;
    removed?: boolean;
};
export type ChatMessageUpdateWithoutStreamInput = {
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    create_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ChatMessageUncheckedUpdateWithoutStreamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    create_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ChatMessageUncheckedUpdateManyWithoutStreamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    uuid?: Prisma.StringFieldUpdateOperationsInput | string;
    create_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    anon_id?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_text_color?: Prisma.StringFieldUpdateOperationsInput | string;
    anon_background_color?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    removed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ChatMessageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    uuid?: boolean;
    create_date?: boolean;
    anon_id?: boolean;
    anon_text_color?: boolean;
    anon_background_color?: boolean;
    name?: boolean;
    message?: boolean;
    removed?: boolean;
    stream_id?: boolean;
    stream?: boolean | Prisma.StreamDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["chatMessage"]>;
export type ChatMessageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    uuid?: boolean;
    create_date?: boolean;
    anon_id?: boolean;
    anon_text_color?: boolean;
    anon_background_color?: boolean;
    name?: boolean;
    message?: boolean;
    removed?: boolean;
    stream_id?: boolean;
    stream?: boolean | Prisma.StreamDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["chatMessage"]>;
export type ChatMessageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    uuid?: boolean;
    create_date?: boolean;
    anon_id?: boolean;
    anon_text_color?: boolean;
    anon_background_color?: boolean;
    name?: boolean;
    message?: boolean;
    removed?: boolean;
    stream_id?: boolean;
    stream?: boolean | Prisma.StreamDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["chatMessage"]>;
export type ChatMessageSelectScalar = {
    id?: boolean;
    uuid?: boolean;
    create_date?: boolean;
    anon_id?: boolean;
    anon_text_color?: boolean;
    anon_background_color?: boolean;
    name?: boolean;
    message?: boolean;
    removed?: boolean;
    stream_id?: boolean;
};
export type ChatMessageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "uuid" | "create_date" | "anon_id" | "anon_text_color" | "anon_background_color" | "name" | "message" | "removed" | "stream_id", ExtArgs["result"]["chatMessage"]>;
export type ChatMessageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stream?: boolean | Prisma.StreamDefaultArgs<ExtArgs>;
};
export type ChatMessageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stream?: boolean | Prisma.StreamDefaultArgs<ExtArgs>;
};
export type ChatMessageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stream?: boolean | Prisma.StreamDefaultArgs<ExtArgs>;
};
export type $ChatMessagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ChatMessage";
    objects: {
        stream: Prisma.$StreamPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        uuid: string;
        create_date: Date;
        anon_id: string;
        anon_text_color: string;
        anon_background_color: string;
        name: string | null;
        message: string;
        removed: boolean;
        stream_id: number;
    }, ExtArgs["result"]["chatMessage"]>;
    composites: {};
};
export type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload, S>;
export type ChatMessageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ChatMessageCountAggregateInputType | true;
};
export interface ChatMessageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'];
        meta: {
            name: 'ChatMessage';
        };
    };
    findUnique<T extends ChatMessageFindUniqueArgs>(args: Prisma.SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ChatMessageFindFirstArgs>(args?: Prisma.SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ChatMessageFindManyArgs>(args?: Prisma.SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ChatMessageCreateArgs>(args: Prisma.SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ChatMessageCreateManyArgs>(args?: Prisma.SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ChatMessageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ChatMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ChatMessageDeleteArgs>(args: Prisma.SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ChatMessageUpdateArgs>(args: Prisma.SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: Prisma.SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ChatMessageUpdateManyArgs>(args: Prisma.SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ChatMessageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ChatMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ChatMessageUpsertArgs>(args: Prisma.SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ChatMessageCountArgs>(args?: Prisma.Subset<T, ChatMessageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ChatMessageCountAggregateOutputType> : number>;
    aggregate<T extends ChatMessageAggregateArgs>(args: Prisma.Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>;
    groupBy<T extends ChatMessageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ChatMessageGroupByArgs['orderBy'];
    } : {
        orderBy?: ChatMessageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ChatMessageFieldRefs;
}
export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    stream<T extends Prisma.StreamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StreamDefaultArgs<ExtArgs>>): Prisma.Prisma__StreamClient<runtime.Types.Result.GetResult<Prisma.$StreamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ChatMessageFieldRefs {
    readonly id: Prisma.FieldRef<"ChatMessage", 'Int'>;
    readonly uuid: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly create_date: Prisma.FieldRef<"ChatMessage", 'DateTime'>;
    readonly anon_id: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly anon_text_color: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly anon_background_color: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly name: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly message: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly removed: Prisma.FieldRef<"ChatMessage", 'Boolean'>;
    readonly stream_id: Prisma.FieldRef<"ChatMessage", 'Int'>;
}
export type ChatMessageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    where: Prisma.ChatMessageWhereUniqueInput;
};
export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    where: Prisma.ChatMessageWhereUniqueInput;
};
export type ChatMessageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ChatMessageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ChatMessageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChatMessageCreateInput, Prisma.ChatMessageUncheckedCreateInput>;
};
export type ChatMessageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ChatMessageCreateManyInput | Prisma.ChatMessageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ChatMessageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    data: Prisma.ChatMessageCreateManyInput | Prisma.ChatMessageCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ChatMessageIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ChatMessageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChatMessageUpdateInput, Prisma.ChatMessageUncheckedUpdateInput>;
    where: Prisma.ChatMessageWhereUniqueInput;
};
export type ChatMessageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ChatMessageUpdateManyMutationInput, Prisma.ChatMessageUncheckedUpdateManyInput>;
    where?: Prisma.ChatMessageWhereInput;
    limit?: number;
};
export type ChatMessageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChatMessageUpdateManyMutationInput, Prisma.ChatMessageUncheckedUpdateManyInput>;
    where?: Prisma.ChatMessageWhereInput;
    limit?: number;
    include?: Prisma.ChatMessageIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ChatMessageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    where: Prisma.ChatMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChatMessageCreateInput, Prisma.ChatMessageUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ChatMessageUpdateInput, Prisma.ChatMessageUncheckedUpdateInput>;
};
export type ChatMessageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    where: Prisma.ChatMessageWhereUniqueInput;
};
export type ChatMessageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChatMessageWhereInput;
    limit?: number;
};
export type ChatMessageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
};
export {};
