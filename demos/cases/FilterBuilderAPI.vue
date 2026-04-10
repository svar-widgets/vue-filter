<script setup>
import { ref } from 'vue';
import { getData } from '../data';
import { FilterBuilder } from '../../src';
import { Button } from '@svar-ui/vue-core';

const { value, fields, options } = getData();

const api = ref();

function noEditLogic(apiInstance) {
	apiInstance.intercept('add-rule', ev => {
		ev.edit = false;
	});
	apiInstance.intercept('add-group', ev => {
		ev.edit = false;
	});
	apiInstance.on('change', () => {
		filterValue.value = '';
	});
}

const filterValue = ref('');

function showValue() {
	const val = api.value.getValue();
	filterValue.value = JSON.stringify(val, null, 2);
}
</script>

<template>
	<h4 style="margin: 20px 20px 0 20px;">
		Click "Add filter" to add a rule. Double-click the rule to edit it
	</h4>
	<div class="toolbar">
		<Button type="secondary" :onclick="showValue">Show value</Button>
	</div>
	<div class="main">
		<div class="filter">
			<FilterBuilder
				ref="api"
				:value="value"
				:fields="fields"
				:options="options"
				:init="noEditLogic"
			/>
		</div>
		<div class="filter-value">
			<pre v-if="filterValue">{{ filterValue }}</pre>
		</div>
	</div>
</template>

<style scoped>
.toolbar {
	display: flex;
	justify-content: flex-start;
	padding: 20px 10px 0px 20px;
}
.main {
	display: flex;
}
.filter {
	padding: 20px;
	min-width: 420px;
	flex: 0;
}
.filter-value {
	flex: 1;
	overflow-x: auto;
	padding: 20px;
}
pre {
	border: var(--wx-border);
	border-radius: 6px;
	padding: 10px;
	margin: 0;
}
</style>
