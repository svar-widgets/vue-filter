import FilterBuilder from './components/FilterBuilder.vue';
import FilterEditor from './components/editor/FilterEditor.vue';
import FilterBar from './components/bar/FilterBar.vue';
import FilterQuery from './components/FilterQuery.vue';

import Willow from './themes/Willow.vue';
import WillowDark from './themes/WillowDark.vue';

export {
	createArrayFilter,
	createFilter,
	getOptions,
	getOptionsMap,
	getFilter,
	getFilters,
	getQueryHtml,
	createFilterRule,
	serialize as getQueryString,
} from '@svar-ui/filter-store';

import { setEnv, env } from '@svar-ui/lib-dom';
setEnv(env);

export {
	FilterBuilder,
	FilterEditor,
	FilterBar,
	FilterQuery,
	Willow,
	WillowDark,
};
