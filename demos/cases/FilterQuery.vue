<script setup>
import { ref, inject } from 'vue';
import { getData } from '../data';
import { FilterQuery, createArrayFilter } from '../../src';

import List from '../custom/List.vue';

const helpers = inject('wx-helpers');

const { fields, options, data } = getData();

// Add tags to options
const optionsWithTags = {
	...options,
	status: ['urgent', 'todo', 'review', 'done', 'blocked'],
};

const value = ref('');
const filteredData = ref(data);

function handleFilter({ text, value, error }) {
	if (error && !text) {
		helpers.showNotice({
			text: error.message,
			type: 'danger',
		});

		if (error.code !== 'NO_DATA') return;
	}

	const filter = createArrayFilter(value, {}, fields);
	filteredData.value = filter(data);
}
</script>

<template>
	<div class="demo">
		<h4 style="margin: 20px 20px 0 20px;">Query Syntax Filtering</h4>
		<div class="natural-input">
			<FilterQuery
				v-model:value="value"
				placeholder="e.g., first_name: Alex or #urgent"
				:fields="[...fields]"
				:options="optionsWithTags"
				:onchange="handleFilter"
			/>
			<p class="hint">Type filter conditions using query syntax. Examples:</p>
			<ul class="examples">
				<li>first_name: *Alex*</li>
				<li>age: &gt;30 and country: USA</li>
				<li>#urgent or #todo</li>
				<li>Just type free text to search all fields</li>
			</ul>
		</div>
		<div class="layout">
			<div class="list">
				<List :data="filteredData" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.demo {
	height: 100vh;
	display: flex;
	flex-direction: column;
}
.natural-input {
	padding: 20px;
}
.hint {
	margin: 12px 0 8px 0;
	font-size: var(--wx-font-size);
}
.examples {
	margin: 0;
	padding-left: 20px;
	font-size: var(--wx-font-size-sm);
}
.examples li {
	margin: 4px 0;
}
.layout {
	display: flex;
	flex-direction: row;
	flex-grow: 1;
	min-height: 600px;
}
.list {
	flex: 1;
}
</style>
