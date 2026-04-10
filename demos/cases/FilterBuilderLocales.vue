<script setup>
import { ref } from 'vue';
import { getData } from '../data';
import { FilterBuilder } from '../../src';
import { Segmented, Locale } from '@svar-ui/vue-core';

import { en, de, cn } from '@svar-ui/filter-locales';
import { en as coreEn, de as coreDe, cn as coreCn } from '@svar-ui/core-locales';

const { value, fields, options } = getData();

const lang = ref('en');
const langs = [
	{ id: 'en', label: 'EN' },
	{ id: 'cn', label: 'CN' },
	{ id: 'de', label: 'DE' },
];

const getWords = (langVal) => {
	let l;
	if (langVal == 'en') l = { ...coreEn, ...en };
	else if (langVal == 'cn') l = { ...coreCn, ...cn };
	else if (langVal == 'de') l = { ...coreDe, ...de };
	return l;
};
</script>

<template>
	<div class="rows">
		<div class="toolbar">
			<Segmented :options="langs" v-model:value="lang" />
		</div>
		<div style="padding: 10px 20px; width: 420px">
			<div class="qcell">
				<Locale :key="lang" :words="getWords(lang)">
					<FilterBuilder :value="value" :fields="fields" :options="options" />
				</Locale>
			</div>
		</div>
	</div>
</template>

<style scoped>
.toolbar {
	padding: 20px 10px 10px 20px;
}
.rows {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.qcell {
	position: relative;
	height: 100%;
}
</style>
