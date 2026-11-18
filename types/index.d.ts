import type { DefineComponent, Component } from "vue";

import type {
	IFilterSet,
	TSingleOptions,
	TFilterType,
	IApi,
	TMethodsConfig,
	TType,
	TPredicate,
	AnyData,
	IFilter,
	IFilterBarField,
	IConfig,
	IField,
	IDataHash,
	ParseResult,
	ValidationError,
} from "@svar-ui/filter-store";

export * from "@svar-ui/filter-store";
export { serialize as getQueryString } from "@svar-ui/filter-store";

export declare const FilterBuilder: DefineComponent<
	{
		type?: "list" | "line" | "simple";
		init?: (api: IApi) => void;
	} & IConfig &
		FilterBuilderActions<TMethodsConfig>
>;

export declare const FilterEditor: DefineComponent<{
	fields?: IConfig["fields"];
	fieldsSelector?: boolean;
	field?: string;
	buttons?: boolean;
	options?: TSingleOptions;
	includes?: AnyData[];
	type?: TType;
	filter?: TFilterType;
	value?: AnyData | { start?: Date; end: Date };
	format?: string | ((value: AnyData) => string);
	predicate: TPredicate;
	onapply: (ev: { value: IFilter }) => void;
	oncancel: (ev: { value: IFilter }) => void;
	onchange: (ev: { value: IFilter }) => void;
}>;

export interface IFilterBarGroup {
	type: "all" | "dynamic";
	by: (string | IFilterBarField)[];
	label?: string;
	placeholder?: string;
	value?: AnyData;
}

export type TFilterBarField = string | IFilterBarField | IFilterBarGroup;

export declare const FilterBar: DefineComponent<{
	fields: TFilterBarField[];
	debounce?: number;
	onchange?: (ev: { value: IFilterSet }) => void;
}>;

export interface FilterQueryEvent {
	value: string | IFilterSet | IFilter | null;
	text: string;
	parsed?: ParseResult;
	error?: ValidationError | null;
	startProgress: () => void;
	endProgress: () => void;
}

export type TFilterQueryParse = "none" | "strict" | "allowFreeText";

export declare const FilterQuery: DefineComponent<{
	value?: string;
	placeholder?: string;
	parse?: TFilterQueryParse;
	fields?: IField[];
	options?: IDataHash<AnyData[]>;
	onchange?: (ev: FilterQueryEvent) => void;
}>;

export declare const Willow: DefineComponent<{
	fonts?: boolean;
}>;

export declare const WillowDark: DefineComponent<{
	fonts?: boolean;
}>;

export declare const Material: DefineComponent<{
	fonts?: boolean;
}>;

/* get component events from store actions*/
type RemoveHyphen<S extends string> = S extends `${infer Head}-${infer Tail}`
	? `${Head}${RemoveHyphen<Tail>}`
	: S;

type EventName<K extends string> = `on${RemoveHyphen<K>}`;

// "add-rule" action -> onaddrule prop, etc.; other actions go to on<name> too
export type FilterBuilderActions<
	T extends Record<string, any> = TMethodsConfig,
> = {
	[K in keyof T as EventName<K & string>]?: (ev: T[K]) => void;
} & {
	[key: `on${string}`]: ((ev?: any) => void) | undefined;
};
