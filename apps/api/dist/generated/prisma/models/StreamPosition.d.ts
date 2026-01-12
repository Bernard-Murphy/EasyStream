import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type StreamPositionModel = runtime.Types.Result.DefaultSelection<Prisma.$StreamPositionPayload>;
export type AggregateStreamPosition = {
    _count: StreamPositionCountAggregateOutputType | null;
    _avg: StreamPositionAvgAggregateOutputType | null;
    _sum: StreamPositionSumAggregateOutputType | null;
    _min: StreamPositionMinAggregateOutputType | null;
    _max: StreamPositionMaxAggregateOutputType | null;
};
export type StreamPositionAvgAggregateOutputType = {
    id: number | null;
    stream_id: number | null;
    stage: number | null;
};
export type StreamPositionSumAggregateOutputType = {
    id: number | null;
    stream_id: number | null;
    stage: number | null;
};
export type StreamPositionMinAggregateOutputType = {
    id: number | null;
    stream_id: number | null;
    stage: number | null;
    peer_id: string | null;
};
export type StreamPositionMaxAggregateOutputType = {
    id: number | null;
    stream_id: number | null;
    stage: number | null;
    peer_id: string | null;
};
export type StreamPositionCountAggregateOutputType = {
    id: number;
    stream_id: number;
    stage: number;
    peer_id: number;
    parents: number;
    children: number;
    _all: number;
};
export type StreamPositionAvgAggregateInputType = {
    id?: true;
    stream_id?: true;
    stage?: true;
};
export type StreamPositionSumAggregateInputType = {
    id?: true;
    stream_id?: true;
    stage?: true;
};
export type StreamPositionMinAggregateInputType = {
    id?: true;
    stream_id?: true;
    stage?: true;
    peer_id?: true;
};
export type StreamPositionMaxAggregateInputType = {
    id?: true;
    stream_id?: true;
    stage?: true;
    peer_id?: true;
};
export type StreamPositionCountAggregateInputType = {
    id?: true;
    stream_id?: true;
    stage?: true;
    peer_id?: true;
    parents?: true;
    children?: true;
    _all?: true;
};
export type StreamPositionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StreamPositionWhereInput;
    orderBy?: Prisma.StreamPositionOrderByWithRelationInput | Prisma.StreamPositionOrderByWithRelationInput[];
    cursor?: Prisma.StreamPositionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StreamPositionCountAggregateInputType;
    _avg?: StreamPositionAvgAggregateInputType;
    _sum?: StreamPositionSumAggregateInputType;
    _min?: StreamPositionMinAggregateInputType;
    _max?: StreamPositionMaxAggregateInputType;
};
export type GetStreamPositionAggregateType<T extends StreamPositionAggregateArgs> = {
    [P in keyof T & keyof AggregateStreamPosition]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStreamPosition[P]> : Prisma.GetScalarType<T[P], AggregateStreamPosition[P]>;
};
export type StreamPositionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StreamPositionWhereInput;
    orderBy?: Prisma.StreamPositionOrderByWithAggregationInput | Prisma.StreamPositionOrderByWithAggregationInput[];
    by: Prisma.StreamPositionScalarFieldEnum[] | Prisma.StreamPositionScalarFieldEnum;
    having?: Prisma.StreamPositionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StreamPositionCountAggregateInputType | true;
    _avg?: StreamPositionAvgAggregateInputType;
    _sum?: StreamPositionSumAggregateInputType;
    _min?: StreamPositionMinAggregateInputType;
    _max?: StreamPositionMaxAggregateInputType;
};
export type StreamPositionGroupByOutputType = {
    id: number;
    stream_id: number;
    stage: number;
    peer_id: string;
    parents: string[];
    children: string[];
    _count: StreamPositionCountAggregateOutputType | null;
    _avg: StreamPositionAvgAggregateOutputType | null;
    _sum: StreamPositionSumAggregateOutputType | null;
    _min: StreamPositionMinAggregateOutputType | null;
    _max: StreamPositionMaxAggregateOutputType | null;
};
type GetStreamPositionGroupByPayload<T extends StreamPositionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StreamPositionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StreamPositionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StreamPositionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StreamPositionGroupByOutputType[P]>;
}>>;
export type StreamPositionWhereInput = {
    AND?: Prisma.StreamPositionWhereInput | Prisma.StreamPositionWhereInput[];
    OR?: Prisma.StreamPositionWhereInput[];
    NOT?: Prisma.StreamPositionWhereInput | Prisma.StreamPositionWhereInput[];
    id?: Prisma.IntFilter<"StreamPosition"> | number;
    stream_id?: Prisma.IntFilter<"StreamPosition"> | number;
    stage?: Prisma.IntFilter<"StreamPosition"> | number;
    peer_id?: Prisma.StringFilter<"StreamPosition"> | string;
    parents?: Prisma.StringNullableListFilter<"StreamPosition">;
    children?: Prisma.StringNullableListFilter<"StreamPosition">;
    stream?: Prisma.XOR<Prisma.StreamScalarRelationFilter, Prisma.StreamWhereInput>;
};
export type StreamPositionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
    stage?: Prisma.SortOrder;
    peer_id?: Prisma.SortOrder;
    parents?: Prisma.SortOrder;
    children?: Prisma.SortOrder;
    stream?: Prisma.StreamOrderByWithRelationInput;
};
export type StreamPositionWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    stream_id_peer_id?: Prisma.StreamPositionStream_idPeer_idCompoundUniqueInput;
    AND?: Prisma.StreamPositionWhereInput | Prisma.StreamPositionWhereInput[];
    OR?: Prisma.StreamPositionWhereInput[];
    NOT?: Prisma.StreamPositionWhereInput | Prisma.StreamPositionWhereInput[];
    stream_id?: Prisma.IntFilter<"StreamPosition"> | number;
    stage?: Prisma.IntFilter<"StreamPosition"> | number;
    peer_id?: Prisma.StringFilter<"StreamPosition"> | string;
    parents?: Prisma.StringNullableListFilter<"StreamPosition">;
    children?: Prisma.StringNullableListFilter<"StreamPosition">;
    stream?: Prisma.XOR<Prisma.StreamScalarRelationFilter, Prisma.StreamWhereInput>;
}, "id" | "stream_id_peer_id">;
export type StreamPositionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
    stage?: Prisma.SortOrder;
    peer_id?: Prisma.SortOrder;
    parents?: Prisma.SortOrder;
    children?: Prisma.SortOrder;
    _count?: Prisma.StreamPositionCountOrderByAggregateInput;
    _avg?: Prisma.StreamPositionAvgOrderByAggregateInput;
    _max?: Prisma.StreamPositionMaxOrderByAggregateInput;
    _min?: Prisma.StreamPositionMinOrderByAggregateInput;
    _sum?: Prisma.StreamPositionSumOrderByAggregateInput;
};
export type StreamPositionScalarWhereWithAggregatesInput = {
    AND?: Prisma.StreamPositionScalarWhereWithAggregatesInput | Prisma.StreamPositionScalarWhereWithAggregatesInput[];
    OR?: Prisma.StreamPositionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StreamPositionScalarWhereWithAggregatesInput | Prisma.StreamPositionScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"StreamPosition"> | number;
    stream_id?: Prisma.IntWithAggregatesFilter<"StreamPosition"> | number;
    stage?: Prisma.IntWithAggregatesFilter<"StreamPosition"> | number;
    peer_id?: Prisma.StringWithAggregatesFilter<"StreamPosition"> | string;
    parents?: Prisma.StringNullableListFilter<"StreamPosition">;
    children?: Prisma.StringNullableListFilter<"StreamPosition">;
};
export type StreamPositionCreateInput = {
    stage: number;
    peer_id: string;
    parents?: Prisma.StreamPositionCreateparentsInput | string[];
    children?: Prisma.StreamPositionCreatechildrenInput | string[];
    stream: Prisma.StreamCreateNestedOneWithoutPositionsInput;
};
export type StreamPositionUncheckedCreateInput = {
    id?: number;
    stream_id: number;
    stage: number;
    peer_id: string;
    parents?: Prisma.StreamPositionCreateparentsInput | string[];
    children?: Prisma.StreamPositionCreatechildrenInput | string[];
};
export type StreamPositionUpdateInput = {
    stage?: Prisma.IntFieldUpdateOperationsInput | number;
    peer_id?: Prisma.StringFieldUpdateOperationsInput | string;
    parents?: Prisma.StreamPositionUpdateparentsInput | string[];
    children?: Prisma.StreamPositionUpdatechildrenInput | string[];
    stream?: Prisma.StreamUpdateOneRequiredWithoutPositionsNestedInput;
};
export type StreamPositionUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    stream_id?: Prisma.IntFieldUpdateOperationsInput | number;
    stage?: Prisma.IntFieldUpdateOperationsInput | number;
    peer_id?: Prisma.StringFieldUpdateOperationsInput | string;
    parents?: Prisma.StreamPositionUpdateparentsInput | string[];
    children?: Prisma.StreamPositionUpdatechildrenInput | string[];
};
export type StreamPositionCreateManyInput = {
    id?: number;
    stream_id: number;
    stage: number;
    peer_id: string;
    parents?: Prisma.StreamPositionCreateparentsInput | string[];
    children?: Prisma.StreamPositionCreatechildrenInput | string[];
};
export type StreamPositionUpdateManyMutationInput = {
    stage?: Prisma.IntFieldUpdateOperationsInput | number;
    peer_id?: Prisma.StringFieldUpdateOperationsInput | string;
    parents?: Prisma.StreamPositionUpdateparentsInput | string[];
    children?: Prisma.StreamPositionUpdatechildrenInput | string[];
};
export type StreamPositionUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    stream_id?: Prisma.IntFieldUpdateOperationsInput | number;
    stage?: Prisma.IntFieldUpdateOperationsInput | number;
    peer_id?: Prisma.StringFieldUpdateOperationsInput | string;
    parents?: Prisma.StreamPositionUpdateparentsInput | string[];
    children?: Prisma.StreamPositionUpdatechildrenInput | string[];
};
export type StreamPositionListRelationFilter = {
    every?: Prisma.StreamPositionWhereInput;
    some?: Prisma.StreamPositionWhereInput;
    none?: Prisma.StreamPositionWhereInput;
};
export type StreamPositionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StreamPositionStream_idPeer_idCompoundUniqueInput = {
    stream_id: number;
    peer_id: string;
};
export type StreamPositionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
    stage?: Prisma.SortOrder;
    peer_id?: Prisma.SortOrder;
    parents?: Prisma.SortOrder;
    children?: Prisma.SortOrder;
};
export type StreamPositionAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
    stage?: Prisma.SortOrder;
};
export type StreamPositionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
    stage?: Prisma.SortOrder;
    peer_id?: Prisma.SortOrder;
};
export type StreamPositionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
    stage?: Prisma.SortOrder;
    peer_id?: Prisma.SortOrder;
};
export type StreamPositionSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stream_id?: Prisma.SortOrder;
    stage?: Prisma.SortOrder;
};
export type StreamPositionCreateNestedManyWithoutStreamInput = {
    create?: Prisma.XOR<Prisma.StreamPositionCreateWithoutStreamInput, Prisma.StreamPositionUncheckedCreateWithoutStreamInput> | Prisma.StreamPositionCreateWithoutStreamInput[] | Prisma.StreamPositionUncheckedCreateWithoutStreamInput[];
    connectOrCreate?: Prisma.StreamPositionCreateOrConnectWithoutStreamInput | Prisma.StreamPositionCreateOrConnectWithoutStreamInput[];
    createMany?: Prisma.StreamPositionCreateManyStreamInputEnvelope;
    connect?: Prisma.StreamPositionWhereUniqueInput | Prisma.StreamPositionWhereUniqueInput[];
};
export type StreamPositionUncheckedCreateNestedManyWithoutStreamInput = {
    create?: Prisma.XOR<Prisma.StreamPositionCreateWithoutStreamInput, Prisma.StreamPositionUncheckedCreateWithoutStreamInput> | Prisma.StreamPositionCreateWithoutStreamInput[] | Prisma.StreamPositionUncheckedCreateWithoutStreamInput[];
    connectOrCreate?: Prisma.StreamPositionCreateOrConnectWithoutStreamInput | Prisma.StreamPositionCreateOrConnectWithoutStreamInput[];
    createMany?: Prisma.StreamPositionCreateManyStreamInputEnvelope;
    connect?: Prisma.StreamPositionWhereUniqueInput | Prisma.StreamPositionWhereUniqueInput[];
};
export type StreamPositionUpdateManyWithoutStreamNestedInput = {
    create?: Prisma.XOR<Prisma.StreamPositionCreateWithoutStreamInput, Prisma.StreamPositionUncheckedCreateWithoutStreamInput> | Prisma.StreamPositionCreateWithoutStreamInput[] | Prisma.StreamPositionUncheckedCreateWithoutStreamInput[];
    connectOrCreate?: Prisma.StreamPositionCreateOrConnectWithoutStreamInput | Prisma.StreamPositionCreateOrConnectWithoutStreamInput[];
    upsert?: Prisma.StreamPositionUpsertWithWhereUniqueWithoutStreamInput | Prisma.StreamPositionUpsertWithWhereUniqueWithoutStreamInput[];
    createMany?: Prisma.StreamPositionCreateManyStreamInputEnvelope;
    set?: Prisma.StreamPositionWhereUniqueInput | Prisma.StreamPositionWhereUniqueInput[];
    disconnect?: Prisma.StreamPositionWhereUniqueInput | Prisma.StreamPositionWhereUniqueInput[];
    delete?: Prisma.StreamPositionWhereUniqueInput | Prisma.StreamPositionWhereUniqueInput[];
    connect?: Prisma.StreamPositionWhereUniqueInput | Prisma.StreamPositionWhereUniqueInput[];
    update?: Prisma.StreamPositionUpdateWithWhereUniqueWithoutStreamInput | Prisma.StreamPositionUpdateWithWhereUniqueWithoutStreamInput[];
    updateMany?: Prisma.StreamPositionUpdateManyWithWhereWithoutStreamInput | Prisma.StreamPositionUpdateManyWithWhereWithoutStreamInput[];
    deleteMany?: Prisma.StreamPositionScalarWhereInput | Prisma.StreamPositionScalarWhereInput[];
};
export type StreamPositionUncheckedUpdateManyWithoutStreamNestedInput = {
    create?: Prisma.XOR<Prisma.StreamPositionCreateWithoutStreamInput, Prisma.StreamPositionUncheckedCreateWithoutStreamInput> | Prisma.StreamPositionCreateWithoutStreamInput[] | Prisma.StreamPositionUncheckedCreateWithoutStreamInput[];
    connectOrCreate?: Prisma.StreamPositionCreateOrConnectWithoutStreamInput | Prisma.StreamPositionCreateOrConnectWithoutStreamInput[];
    upsert?: Prisma.StreamPositionUpsertWithWhereUniqueWithoutStreamInput | Prisma.StreamPositionUpsertWithWhereUniqueWithoutStreamInput[];
    createMany?: Prisma.StreamPositionCreateManyStreamInputEnvelope;
    set?: Prisma.StreamPositionWhereUniqueInput | Prisma.StreamPositionWhereUniqueInput[];
    disconnect?: Prisma.StreamPositionWhereUniqueInput | Prisma.StreamPositionWhereUniqueInput[];
    delete?: Prisma.StreamPositionWhereUniqueInput | Prisma.StreamPositionWhereUniqueInput[];
    connect?: Prisma.StreamPositionWhereUniqueInput | Prisma.StreamPositionWhereUniqueInput[];
    update?: Prisma.StreamPositionUpdateWithWhereUniqueWithoutStreamInput | Prisma.StreamPositionUpdateWithWhereUniqueWithoutStreamInput[];
    updateMany?: Prisma.StreamPositionUpdateManyWithWhereWithoutStreamInput | Prisma.StreamPositionUpdateManyWithWhereWithoutStreamInput[];
    deleteMany?: Prisma.StreamPositionScalarWhereInput | Prisma.StreamPositionScalarWhereInput[];
};
export type StreamPositionCreateparentsInput = {
    set: string[];
};
export type StreamPositionCreatechildrenInput = {
    set: string[];
};
export type StreamPositionUpdateparentsInput = {
    set?: string[];
    push?: string | string[];
};
export type StreamPositionUpdatechildrenInput = {
    set?: string[];
    push?: string | string[];
};
export type StreamPositionCreateWithoutStreamInput = {
    stage: number;
    peer_id: string;
    parents?: Prisma.StreamPositionCreateparentsInput | string[];
    children?: Prisma.StreamPositionCreatechildrenInput | string[];
};
export type StreamPositionUncheckedCreateWithoutStreamInput = {
    id?: number;
    stage: number;
    peer_id: string;
    parents?: Prisma.StreamPositionCreateparentsInput | string[];
    children?: Prisma.StreamPositionCreatechildrenInput | string[];
};
export type StreamPositionCreateOrConnectWithoutStreamInput = {
    where: Prisma.StreamPositionWhereUniqueInput;
    create: Prisma.XOR<Prisma.StreamPositionCreateWithoutStreamInput, Prisma.StreamPositionUncheckedCreateWithoutStreamInput>;
};
export type StreamPositionCreateManyStreamInputEnvelope = {
    data: Prisma.StreamPositionCreateManyStreamInput | Prisma.StreamPositionCreateManyStreamInput[];
    skipDuplicates?: boolean;
};
export type StreamPositionUpsertWithWhereUniqueWithoutStreamInput = {
    where: Prisma.StreamPositionWhereUniqueInput;
    update: Prisma.XOR<Prisma.StreamPositionUpdateWithoutStreamInput, Prisma.StreamPositionUncheckedUpdateWithoutStreamInput>;
    create: Prisma.XOR<Prisma.StreamPositionCreateWithoutStreamInput, Prisma.StreamPositionUncheckedCreateWithoutStreamInput>;
};
export type StreamPositionUpdateWithWhereUniqueWithoutStreamInput = {
    where: Prisma.StreamPositionWhereUniqueInput;
    data: Prisma.XOR<Prisma.StreamPositionUpdateWithoutStreamInput, Prisma.StreamPositionUncheckedUpdateWithoutStreamInput>;
};
export type StreamPositionUpdateManyWithWhereWithoutStreamInput = {
    where: Prisma.StreamPositionScalarWhereInput;
    data: Prisma.XOR<Prisma.StreamPositionUpdateManyMutationInput, Prisma.StreamPositionUncheckedUpdateManyWithoutStreamInput>;
};
export type StreamPositionScalarWhereInput = {
    AND?: Prisma.StreamPositionScalarWhereInput | Prisma.StreamPositionScalarWhereInput[];
    OR?: Prisma.StreamPositionScalarWhereInput[];
    NOT?: Prisma.StreamPositionScalarWhereInput | Prisma.StreamPositionScalarWhereInput[];
    id?: Prisma.IntFilter<"StreamPosition"> | number;
    stream_id?: Prisma.IntFilter<"StreamPosition"> | number;
    stage?: Prisma.IntFilter<"StreamPosition"> | number;
    peer_id?: Prisma.StringFilter<"StreamPosition"> | string;
    parents?: Prisma.StringNullableListFilter<"StreamPosition">;
    children?: Prisma.StringNullableListFilter<"StreamPosition">;
};
export type StreamPositionCreateManyStreamInput = {
    id?: number;
    stage: number;
    peer_id: string;
    parents?: Prisma.StreamPositionCreateparentsInput | string[];
    children?: Prisma.StreamPositionCreatechildrenInput | string[];
};
export type StreamPositionUpdateWithoutStreamInput = {
    stage?: Prisma.IntFieldUpdateOperationsInput | number;
    peer_id?: Prisma.StringFieldUpdateOperationsInput | string;
    parents?: Prisma.StreamPositionUpdateparentsInput | string[];
    children?: Prisma.StreamPositionUpdatechildrenInput | string[];
};
export type StreamPositionUncheckedUpdateWithoutStreamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    stage?: Prisma.IntFieldUpdateOperationsInput | number;
    peer_id?: Prisma.StringFieldUpdateOperationsInput | string;
    parents?: Prisma.StreamPositionUpdateparentsInput | string[];
    children?: Prisma.StreamPositionUpdatechildrenInput | string[];
};
export type StreamPositionUncheckedUpdateManyWithoutStreamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    stage?: Prisma.IntFieldUpdateOperationsInput | number;
    peer_id?: Prisma.StringFieldUpdateOperationsInput | string;
    parents?: Prisma.StreamPositionUpdateparentsInput | string[];
    children?: Prisma.StreamPositionUpdatechildrenInput | string[];
};
export type StreamPositionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stream_id?: boolean;
    stage?: boolean;
    peer_id?: boolean;
    parents?: boolean;
    children?: boolean;
    stream?: boolean | Prisma.StreamDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["streamPosition"]>;
export type StreamPositionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stream_id?: boolean;
    stage?: boolean;
    peer_id?: boolean;
    parents?: boolean;
    children?: boolean;
    stream?: boolean | Prisma.StreamDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["streamPosition"]>;
export type StreamPositionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stream_id?: boolean;
    stage?: boolean;
    peer_id?: boolean;
    parents?: boolean;
    children?: boolean;
    stream?: boolean | Prisma.StreamDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["streamPosition"]>;
export type StreamPositionSelectScalar = {
    id?: boolean;
    stream_id?: boolean;
    stage?: boolean;
    peer_id?: boolean;
    parents?: boolean;
    children?: boolean;
};
export type StreamPositionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "stream_id" | "stage" | "peer_id" | "parents" | "children", ExtArgs["result"]["streamPosition"]>;
export type StreamPositionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stream?: boolean | Prisma.StreamDefaultArgs<ExtArgs>;
};
export type StreamPositionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stream?: boolean | Prisma.StreamDefaultArgs<ExtArgs>;
};
export type StreamPositionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stream?: boolean | Prisma.StreamDefaultArgs<ExtArgs>;
};
export type $StreamPositionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StreamPosition";
    objects: {
        stream: Prisma.$StreamPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        stream_id: number;
        stage: number;
        peer_id: string;
        parents: string[];
        children: string[];
    }, ExtArgs["result"]["streamPosition"]>;
    composites: {};
};
export type StreamPositionGetPayload<S extends boolean | null | undefined | StreamPositionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StreamPositionPayload, S>;
export type StreamPositionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StreamPositionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StreamPositionCountAggregateInputType | true;
};
export interface StreamPositionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StreamPosition'];
        meta: {
            name: 'StreamPosition';
        };
    };
    findUnique<T extends StreamPositionFindUniqueArgs>(args: Prisma.SelectSubset<T, StreamPositionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StreamPositionClient<runtime.Types.Result.GetResult<Prisma.$StreamPositionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StreamPositionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StreamPositionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StreamPositionClient<runtime.Types.Result.GetResult<Prisma.$StreamPositionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StreamPositionFindFirstArgs>(args?: Prisma.SelectSubset<T, StreamPositionFindFirstArgs<ExtArgs>>): Prisma.Prisma__StreamPositionClient<runtime.Types.Result.GetResult<Prisma.$StreamPositionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StreamPositionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StreamPositionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StreamPositionClient<runtime.Types.Result.GetResult<Prisma.$StreamPositionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StreamPositionFindManyArgs>(args?: Prisma.SelectSubset<T, StreamPositionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StreamPositionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StreamPositionCreateArgs>(args: Prisma.SelectSubset<T, StreamPositionCreateArgs<ExtArgs>>): Prisma.Prisma__StreamPositionClient<runtime.Types.Result.GetResult<Prisma.$StreamPositionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StreamPositionCreateManyArgs>(args?: Prisma.SelectSubset<T, StreamPositionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StreamPositionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StreamPositionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StreamPositionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StreamPositionDeleteArgs>(args: Prisma.SelectSubset<T, StreamPositionDeleteArgs<ExtArgs>>): Prisma.Prisma__StreamPositionClient<runtime.Types.Result.GetResult<Prisma.$StreamPositionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StreamPositionUpdateArgs>(args: Prisma.SelectSubset<T, StreamPositionUpdateArgs<ExtArgs>>): Prisma.Prisma__StreamPositionClient<runtime.Types.Result.GetResult<Prisma.$StreamPositionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StreamPositionDeleteManyArgs>(args?: Prisma.SelectSubset<T, StreamPositionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StreamPositionUpdateManyArgs>(args: Prisma.SelectSubset<T, StreamPositionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StreamPositionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StreamPositionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StreamPositionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StreamPositionUpsertArgs>(args: Prisma.SelectSubset<T, StreamPositionUpsertArgs<ExtArgs>>): Prisma.Prisma__StreamPositionClient<runtime.Types.Result.GetResult<Prisma.$StreamPositionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StreamPositionCountArgs>(args?: Prisma.Subset<T, StreamPositionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StreamPositionCountAggregateOutputType> : number>;
    aggregate<T extends StreamPositionAggregateArgs>(args: Prisma.Subset<T, StreamPositionAggregateArgs>): Prisma.PrismaPromise<GetStreamPositionAggregateType<T>>;
    groupBy<T extends StreamPositionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StreamPositionGroupByArgs['orderBy'];
    } : {
        orderBy?: StreamPositionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StreamPositionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStreamPositionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StreamPositionFieldRefs;
}
export interface Prisma__StreamPositionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    stream<T extends Prisma.StreamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StreamDefaultArgs<ExtArgs>>): Prisma.Prisma__StreamClient<runtime.Types.Result.GetResult<Prisma.$StreamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StreamPositionFieldRefs {
    readonly id: Prisma.FieldRef<"StreamPosition", 'Int'>;
    readonly stream_id: Prisma.FieldRef<"StreamPosition", 'Int'>;
    readonly stage: Prisma.FieldRef<"StreamPosition", 'Int'>;
    readonly peer_id: Prisma.FieldRef<"StreamPosition", 'String'>;
    readonly parents: Prisma.FieldRef<"StreamPosition", 'String[]'>;
    readonly children: Prisma.FieldRef<"StreamPosition", 'String[]'>;
}
export type StreamPositionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamPositionSelect<ExtArgs> | null;
    omit?: Prisma.StreamPositionOmit<ExtArgs> | null;
    include?: Prisma.StreamPositionInclude<ExtArgs> | null;
    where: Prisma.StreamPositionWhereUniqueInput;
};
export type StreamPositionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamPositionSelect<ExtArgs> | null;
    omit?: Prisma.StreamPositionOmit<ExtArgs> | null;
    include?: Prisma.StreamPositionInclude<ExtArgs> | null;
    where: Prisma.StreamPositionWhereUniqueInput;
};
export type StreamPositionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StreamPositionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StreamPositionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StreamPositionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamPositionSelect<ExtArgs> | null;
    omit?: Prisma.StreamPositionOmit<ExtArgs> | null;
    include?: Prisma.StreamPositionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StreamPositionCreateInput, Prisma.StreamPositionUncheckedCreateInput>;
};
export type StreamPositionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StreamPositionCreateManyInput | Prisma.StreamPositionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StreamPositionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamPositionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StreamPositionOmit<ExtArgs> | null;
    data: Prisma.StreamPositionCreateManyInput | Prisma.StreamPositionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StreamPositionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StreamPositionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamPositionSelect<ExtArgs> | null;
    omit?: Prisma.StreamPositionOmit<ExtArgs> | null;
    include?: Prisma.StreamPositionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StreamPositionUpdateInput, Prisma.StreamPositionUncheckedUpdateInput>;
    where: Prisma.StreamPositionWhereUniqueInput;
};
export type StreamPositionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StreamPositionUpdateManyMutationInput, Prisma.StreamPositionUncheckedUpdateManyInput>;
    where?: Prisma.StreamPositionWhereInput;
    limit?: number;
};
export type StreamPositionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamPositionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StreamPositionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StreamPositionUpdateManyMutationInput, Prisma.StreamPositionUncheckedUpdateManyInput>;
    where?: Prisma.StreamPositionWhereInput;
    limit?: number;
    include?: Prisma.StreamPositionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StreamPositionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamPositionSelect<ExtArgs> | null;
    omit?: Prisma.StreamPositionOmit<ExtArgs> | null;
    include?: Prisma.StreamPositionInclude<ExtArgs> | null;
    where: Prisma.StreamPositionWhereUniqueInput;
    create: Prisma.XOR<Prisma.StreamPositionCreateInput, Prisma.StreamPositionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StreamPositionUpdateInput, Prisma.StreamPositionUncheckedUpdateInput>;
};
export type StreamPositionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamPositionSelect<ExtArgs> | null;
    omit?: Prisma.StreamPositionOmit<ExtArgs> | null;
    include?: Prisma.StreamPositionInclude<ExtArgs> | null;
    where: Prisma.StreamPositionWhereUniqueInput;
};
export type StreamPositionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StreamPositionWhereInput;
    limit?: number;
};
export type StreamPositionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StreamPositionSelect<ExtArgs> | null;
    omit?: Prisma.StreamPositionOmit<ExtArgs> | null;
    include?: Prisma.StreamPositionInclude<ExtArgs> | null;
};
export {};
