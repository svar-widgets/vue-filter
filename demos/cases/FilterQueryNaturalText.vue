<script setup>
/* eslint-disable vue/no-v-html */
import { ref, computed, inject } from 'vue';
import { getData } from '../data';
import {
	FilterQuery,
	createArrayFilter,
	getQueryHtml,
	getQueryString,
} from '../../src';

import List from '../custom/List.vue';

const helpers = inject('wx-helpers');

const { fields, data } = getData();

const filteredData = ref(data);
const filterConfig = ref(null);
const queryHTML = computed(() =>
	filterConfig.value
		? getQueryHtml(getQueryString(filterConfig.value).query, { fields })
		: ''
);

async function handleFilter({ text, startProgress, endProgress }) {
	try {
		startProgress();
		const val = await text2filter(text, fields);
		if (val) {
			filterConfig.value = val;
			const filter = createArrayFilter(val);
			filteredData.value = filter(data);
		}
	} finally {
		endProgress();
	}
}

const url =
	'https://master--svar-filter-natural-text--dev.webix.io/text-to-json';
async function text2filter(text, fields) {
	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify({ text, fields }),
	});
	const json = await response.json();
	if (!response.ok) {
		helpers.showNotice({
			text: json.error || 'Request failed',
			type: 'danger',
		});
		return null;
	}
	return json;
}
</script>

<template>
	<div class="demo">
		<h4 style="margin: 20px 20px 0 20px;">Filtering by text prompt</h4>
		<div class="natural-input">
			<FilterQuery
				placeholder="e.g., first name contains Alex and age greater than 30"
				:onchange="handleFilter"
				parse="none"
			/>
			<div class="rules" v-html="queryHTML || '&nbsp;'"></div>
			<p class="hint">
				Type filter conditions in natural language. Examples:
			</p>
			<ul class="examples">
				<li>Alex, below forty</li>
				<li>age greater than 30 from USA</li>
				<li>started in last two years</li>
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
	font-size: 14px;
}
.examples {
	margin: 0;
	padding-left: 20px;
	font-size: 13px;
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
.rules {
	padding: 4px;
	background-color: #f9f9f9;
}

:global(.wx-willow-dark-theme .rules) {
	background-color: #384047;
}
</style>
