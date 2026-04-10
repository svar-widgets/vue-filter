<script setup>
import { ref } from 'vue';
import { getData } from '../data';
import { FilterBar, createArrayFilter } from '../../src';
import List from '../custom/List.vue';

const { options, data } = getData();
const filteredData = ref(data);

function applyFilter(val) {
	const filter = createArrayFilter(val);
	filteredData.value = filter(data);
}

// set initial value
const value = {
	rules: [{ field: 'country', filter: 'equal', value: 'USA' }],
};

applyFilter(value);
</script>

<template>
	<h4 style="margin: 20px 20px 0 20px;">
		Fill in the inputs to edit filtering conditions
	</h4>
	<div style="padding: 0 20px;">
		<FilterBar
			:fields="[
				'last_name',
				{
					type: 'number',
					id: 'age',
				},
				{
					type: 'text',
					id: 'country',
					options: options.country,
					value: 'USA',
				},
			]"
			:onchange="({ value }) => applyFilter(value)"
		/>
		<List :data="filteredData" />
	</div>
</template>
