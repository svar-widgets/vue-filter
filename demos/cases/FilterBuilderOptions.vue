<script setup>
import { ref } from 'vue';
import { getData } from '../data';
import List from '../custom/List.vue';
import { FilterBuilder, createArrayFilter } from '../../src';

const { fields, data } = getData();
const options = getData().options;

const value = {
	glue: 'or',
	rules: [
		{
			field: 'first_name',
			filter: 'equal',
			type: 'text',
			value: 'Alex',
		},
		{
			field: 'first_name',
			filter: 'contains',
			type: 'text',
			value: 'D',
		},
	],
};

const filteredData = ref(data);

function applyFilter(val) {
	const filter = createArrayFilter(val);
	filteredData.value = filter(data);
}

async function provideOptions(fieldId) {
	//simulate async data fetching
	await new Promise(resolve => setTimeout(resolve, 300));
	return options[fieldId] || [];
}

// apply initial filter state
applyFilter(value);
</script>

<template>
	<div class="demo">
		<h4 style="margin: 20px 20px 0 20px;">
			Double-click any element to edit filtering conditions. Field options
			will be loaded on demand
		</h4>
		<div class="layout">
			<div class="filter">
				<FilterBuilder
					:fields="fields"
					:value="value"
					:options="provideOptions"
					:onchange="({ value }) => applyFilter(value)"
				/>
			</div>
			<div class="list">
				<List :data="filteredData" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.demo {
	height: 100%;
	display: flex;
	flex-direction: column;
}
.layout {
	display: flex;
	flex-direction: row;
	flex-grow: 1;
	min-height: 600px;
}
.filter {
	padding: 20px;
	min-width: 360px;
	flex: 0;
}
.list {
	flex: 1;
}
</style>
