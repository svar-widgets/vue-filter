<script setup>
/* eslint-disable vue/no-v-html -- getQueryHtml escapes all user input */
import { computed } from 'vue';
import { getQueryHtml } from '@svar-ui/filter-store';

const props = defineProps({
	query: { default: '' },
	fields: { default: () => [] },
	options: { default: () => ({}) },
	inline: { default: false },
	showErrors: { default: true },
	cursorPos: { default: -1 },
	parse: { default: 'allowFreeText' },
});

const highlightedHtml = computed(() =>
	getQueryHtml(props.query, {
		fields: props.fields,
		options: props.options,
		showErrors: props.showErrors,
		cursorPos: props.cursorPos,
		allowFreeText: props.parse === 'allowFreeText',
	})
);
</script>

<template>
	<template v-if="inline">
		<span v-html="highlightedHtml"></span>
	</template>
	<div v-else-if="query" class="wx-query-highlight" v-html="highlightedHtml"></div>
</template>

<style scoped>
.wx-query-highlight {
	font-family: monospace;
	padding: var(--wx-padding) 12px;
	background: var(--wx-background-alt);
	border: var(--wx-border);
	border-radius: var(--wx-border-radius);
	margin-top: var(--wx-padding);
	white-space: pre-wrap;
	word-break: break-word;
}
</style>
