<script setup>
defineOptions({ name: 'FilterLayout' });

import { ref, computed, inject } from 'vue';
import { subscribe } from '@svar-ui/lib-vue';

import { Button } from '@svar-ui/vue-core';
import { DropDownMenu, ContextMenu } from '@svar-ui/vue-menu';
import List from './editor/List.vue';

const props = defineProps({
	type: {},
});

const api = inject('wx-filter-store');
const _ = inject('wx-i18n').getGroup('filter');

const reactiveState = api.getReactiveState();
const value = subscribe(reactiveState.value, true);
const fields = subscribe(reactiveState.fields);
const group = computed(() => value.value.getBranch(0)[0]);

function addFilter(data) {
    api.exec('add-rule', { rule: { $temp: true, ...data }, edit: true });  
}

const newFilterOptions = computed(() => {
	const now = {};
	value.value.forEach(x => (now[x.field] = true));
	return fields.value
		.filter(c => !now[c.id])
		.map(o => ({ id: o.id, text: o.label }));
});

function selectNewFilter(ev) {
	const action = ev.action;
	if (action) {
		addFilter({ field: action.id });
	}
}

const menuOptions = [
	{
		id: 'edit-rule',
		text: _('Edit'),
		icon: 'wxi-edit-outline',
	},
	{
		id: 'add-rule',
		text: _('Add filter'),
		icon: 'wxi-filter-plus-outline',
		resolver: item => ({
			after: item,
			rule: { $temp: true },
			edit: true,
		}),
	},
	{
		id: 'add-group',
		text: _('Add group'),
		icon: 'wxi-filter-multiple-outline',
		resolver: item => ({
			after: item,
			rule: { $temp: true },
			edit: true,
		}),
	},
	{ type: 'separator' },
	{
		id: 'delete-rule',
		text: _('Delete'),
		icon: 'wxi-delete-outline',
	},
];

const menu = ref();

const menuAction = ev => {
	const { context: item, action } = ev;
	if (action) {
		const data = action.resolver ? action.resolver(item) : { id: item };
		api.exec(action.id, data);
	}
};

const onshowmenu = ({ ev, id }) => {
	menu.value.show(ev, id);
};
</script>

<template>
	<div :class="['wx-filter-builder', `wx-${type}`]">
		<template v-if="type === 'list'">
			<div :class="['wx-toolbar', `wx-${type}`]">
				<Button type="primary" :onclick="addFilter">
					{{ _('Add filter') }}
				</Button>
			</div>
			<List :type="type" :group="group" :onshowmenu="onshowmenu" />
		</template>
		<template v-else-if="type === 'line'">
			<div :class="['wx-toolbar', `wx-${type}`]">
				<div class="wx-filters">
					<List :type="type" :group="group" :onshowmenu="onshowmenu" />
				</div>

				<div class="wx-button">
					<Button type="primary" :onclick="addFilter">
						{{ _('Add filter') }}
					</Button>
				</div>
			</div>
		</template>
		<template v-else-if="type === 'simple'">
			<div :class="['wx-toolbar', `wx-${type}`]">
				<div class="wx-button">
					<DropDownMenu
						:options="newFilterOptions"
						:onclick="selectNewFilter"
					>
						<Button :disabled="!newFilterOptions.length" type="primary">
							{{ _('Add filter') }}
						</Button>
					</DropDownMenu>
				</div>

				<div class="wx-filters">
					<List :type="type" :group="group" :onshowmenu="onshowmenu" />
				</div>
			</div>
		</template>
	</div>
	<ContextMenu v-if="type !== 'simple'" :options="menuOptions" :onclick="menuAction" ref="menu" />
</template>

<style scoped>
.wx-filter-builder {
	background-color: var(--wx-background);
}
.wx-filter-builder.wx-list {
	padding: 0;
	max-width: 470px;
}

/* line */
.wx-button {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.wx-toolbar.wx-line,
.wx-toolbar.wx-simple {
	display: flex;
	flex-direction: row;
	gap: 20px;
	height: 67px;
}

.wx-toolbar.wx-line {
	justify-content: space-between;
}

.wx-filters {
	overflow-x: auto;
	display: flex;
}
</style>
