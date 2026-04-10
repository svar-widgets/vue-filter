<script setup>
defineOptions({ name: 'FilterEditorGlue' });

import { inject } from 'vue';

const props = defineProps({
	mode: { default: 'and' },
	id: {},
});

const _ = inject('wx-i18n').getGroup('filter');
const api = inject('wx-filter-store');

function toggleGlue() {
	api.exec('toggle-glue', { id: props.id });
}
</script>

<template>
	<div :class="['wx-glue', `wx-${mode}`]" role="button" @click="toggleGlue">
		{{ _(mode) }}
	</div>
</template>

<style scoped>
.wx-glue {
	cursor: pointer;
	border-radius: var(--wx-line-height);
	display: inline-block;
	line-height: var(--wx-line-height);
	width: 40px;
	text-align: center;
	user-select: none;
}

.wx-glue:hover {
	background-image: linear-gradient(
		rgba(0, 0, 0, 0.1) 0%,
		rgba(0, 0, 0, 0.1) 100%
	);
}

.wx-and {
	background-color: var(--wx-filter-and-background);
	color: var(--wx-filter-and-font-color);
}

.wx-or {
	background-color: var(--wx-filter-or-background);
	color: var(--wx-filter-or-font-color);
}
</style>
