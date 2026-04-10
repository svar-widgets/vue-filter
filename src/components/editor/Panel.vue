<script setup>
defineOptions({ name: 'FilterEditorPanel' });

import { inject } from 'vue';
import { subscribe } from '@svar-ui/lib-vue';
import FilterEditor from './FilterEditor.vue';

const props = defineProps({
	rule: {},
	type: {},
});

const includes =
	props.rule.includes && props.rule.includes.length ? props.rule.includes : null;
const filter = props.rule.filter || 'contains';
const value = props.rule.value || '';
const field = props.rule.field;
const id = props.rule.id;

const api = inject('wx-filter-store');

const reactiveState = api.getReactiveState();
const fields = subscribe(reactiveState.fields);
const options = subscribe(reactiveState.options);

function doApply({ value }) {
	api.exec('update-rule', { id, rule: value });
	doCancel();
}

function doCancel() {
	api.exec('edit-rule', {});
}

function doChange({ value }) {
	api.exec('change-rule', { id, rule: value });
}
</script>

<template>
	<div class="wx-panel">
		<FilterEditor
			:fields-selector="type !== 'simple'"
			:fields="fields"
			:field="field"
			:options="options"
			:includes="includes"
			:filter="filter"
			:value="value"
			:onapply="doApply"
			:oncancel="doCancel"
			:onchange="doChange"
		/>
	</div>
</template>

<style scoped>
.wx-panel {
	padding-top: 15px;
}
</style>
