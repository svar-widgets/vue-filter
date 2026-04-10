import FilterBuilderBasic from './cases/FilterBuilderBasic.vue';
import FilterBuilderLine from './cases/FilterBuilderLine.vue';
import FilterBuilderSimple from './cases/FilterBuilderSimple.vue';
import FilterBuilderOptions from './cases/FilterBuilderOptions.vue';
import FilterBuilderDates from './cases/FilterBuilderDates.vue';
import FilterBuilderAPI from './cases/FilterBuilderAPI.vue';
import FilterBuilderLocales from './cases/FilterBuilderLocales.vue';
import FilterBuilderConvertDates from './cases/FilterBuilderConvertDates.vue';
import FilterBuilderBackend from './cases/FilterBuilderBackend.vue';
import FilterQuery from './cases/FilterQuery.vue';
import FilterQueryMixed from './cases/FilterQueryMixed.vue';
import FilterQueryNaturalText from './cases/FilterQueryNaturalText.vue';
import FilterEditorBasic from './cases/FilterEditorBasic.vue';
import FilterEditorEvents from './cases/FilterEditorEvents.vue';
import FilterEditorFields from './cases/FilterEditorFields.vue';
import FilterEditorDates from './cases/FilterEditorDates.vue';
import FilterEditorOptions from './cases/FilterEditorOptions.vue';
import FilterBar from './cases/FilterBar.vue';
import FilterBarCombined from './cases/FilterBarCombined.vue';
import FilterBarDates from './cases/FilterBarDates.vue';

export const links = [
	[
		'/base/:skin',
		'Basic Filter Builder',
		FilterBuilderBasic,
		'FilterBuilderBasic',
	],
	[
		'/filter-builder-line/:skin',
		'Filter Builder: line mode',
		FilterBuilderLine,
		'FilterBuilderLine',
	],
	[
		'/filter-builder-simple/:skin',
		'Filter Builder: simple mode',
		FilterBuilderSimple,
		'FilterBuilderSimple',
	],
	[
		'/filter-builder-options/:skin',
		'Filter Builder: dynamic options',
		FilterBuilderOptions,
		'FilterBuilderOptions',
	],
	[
		'/filter-builder-dates/:skin',
		'Filter Builder: working with dates',
		FilterBuilderDates,
		'FilterBuilderDates',
	],
	[
		'/filter-builder-api/:skin',
		'Filter Builder: API',
		FilterBuilderAPI,
		'FilterBuilderAPI',
	],
	[
		'/filter-builder-locales/:skin',
		'Filter Builder: locales',
		FilterBuilderLocales,
		'FilterBuilderLocales',
	],
	[
		'/filter-builder-convert-dates/:skin',
		'Filter Builder: convert dates',
		FilterBuilderConvertDates,
		'FilterBuilderConvertDates',
	],
	[
		'/filter-builder-backend/:skin',
		'Filter Builder: backend',
		FilterBuilderBackend,
		'FilterBuilderBackend',
	],
	[
		'/filter-query/:skin',
		'Filter Query: query string',
		FilterQuery,
		'FilterQuery',
	],
	[
		'/filter-query-natural-text/:skin',
		'Filter Query: natural text',
		FilterQueryNaturalText,
		'FilterQueryNaturalText',
	],
	[
		'/filter-query-mixed/:skin',
		'Filter Query: mixed',
		FilterQueryMixed,
		'FilterQueryMixed',
	],
	[
		'/filter-editor-base/:skin',
		'Basic Filter Editor',
		FilterEditorBasic,
		'FilterEditorBasic',
	],
	[
		'/filter-editor-events/:skin',
		'Filter Editor: events',
		FilterEditorEvents,
		'FilterEditorEvents',
	],
	[
		'/filter-editor-fields/:skin',
		'Filter Editor: multiple fields',
		FilterEditorFields,
		'FilterEditorFields',
	],
	[
		'/filter-editor-dates/:skin',
		'Filter Editor: working with dates',
		FilterEditorDates,
		'FilterEditorDates',
	],
	[
		'/filter-editor-options/:skin',
		'Filter Editor: formatting options',
		FilterEditorOptions,
		'FilterEditorOptions',
	],
	['/filter-bar/:skin', 'Basic Filter Bar', FilterBar, 'FilterBar'],
	[
		'/filter-bar-combined/:skin',
		'Filter Bar: combined fields',
		FilterBarCombined,
		'FilterBarCombined',
	],
	[
		'/filter-bar-dates/:skin',
		'Filter Bar: working with dates',
		FilterBarDates,
		'FilterBarDates',
	],
];
