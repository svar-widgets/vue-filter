<script setup>
defineOptions({ name: 'FilterEditorRule' });

import { ref, computed, watch } from 'vue';
import { getFilter } from '@svar-ui/filter-store';
import { dateToString } from '@svar-ui/lib-dom';
import { inject } from 'vue';

const props = defineProps({
	filter: {},
	field: {},
	type: { default: 'list' },
	action: { default: 'menu' },
});

const noChange = v => v;
const locale = inject('wx-i18n');
const l = locale.getRaw();
const f = computed(() => props.field?.format || l.filter?.dateFormat || l.formats.dateFormat);

const _format = computed(() =>
	typeof f.value === 'function'
		? f.value
		: props.field.type === 'date'
			? dateToString(f.value, l.calendar)
			: noChange
);

const _ = locale.getGroup('filter');

const rule = ref();
const filterValue = ref();

watch(() => props.filter, () => {
	filterValue.value = props.filter.value;
	rule.value = props.filter.filter ? getFilter(props.filter.filter, props.filter.type) : null;
}, { immediate: true });
</script>

<template>
	<div :class="['wx-rule', `wx-${type}`]" :data-id="filter.id">
		<span class="wx-filter">
			<span class="wx-field">{{ field.label }}&nbsp;</span>
			<template v-if="filter.includes && filter.includes.length">
				{{ _('in') }}
				<template v-for="(value, i) in filter.includes" :key="value">
					<span class="wx-value">{{ _format(value) }}</span>
					<template v-if="i < filter.includes.length - 1">,&nbsp;</template>
				</template>
			</template>
			<template v-else-if="filter.filter && (filterValue || filterValue === 0)">
				{{ _(rule.short || rule.label) || rule.id }}
				<template v-if="field.type === 'date'">
					<template v-if="filterValue.start">
						<span class="wx-value">{{ _format(filterValue.start) }}</span>
						{{ _('and') }}
						<span class="wx-value">{{ _format(filterValue.end) }}</span>
					</template>
					<span v-else class="wx-value">{{ _format(filterValue) }}</span>
				</template>
				<span v-else class="wx-value">{{ _format(filterValue) }}</span>
			</template>
		</span>
		<i
			:class="[`wxi-${action === 'menu' ? 'dots-v' : action}`, 'wx-menu-icon']"
			role="button"
			:data-action="action"
		></i>
	</div>
</template>

<style scoped>
.wx-rule {
	background: var(--wx-background-alt);
	border-radius: var(--wx-border-radius);
	white-space: nowrap;
	position: relative;
	display: flex;
	align-items: center;
}

.wx-rule.wx-list {
	padding: 12px 8px;
	margin: 10px 0;
}
.wx-rule.wx-line {
	height: 36px;
	padding: 8px;
}

.wx-field {
	font-weight: var(--wx-font-weight-md);
}

.wx-filter {
	display: inline-block;
	max-width: 90%;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-right: 45px;
}

.wx-value {
	color: var(--wx-filter-value-color);
}

.wx-menu-icon {
	position: absolute;
	right: 8px;
	cursor: pointer;
	width: var(--wx-line-height);
	height: var(--wx-line-height);
	line-height: var(--wx-line-height);
	text-align: center;
	border-radius: var(--wx-line-height);
}

.wx-menu-icon.wxi-dots-h {
	background: var(--wx-background);
}

.wx-menu-icon:hover {
	background-image: linear-gradient(
		rgba(0, 0, 0, 0.1) 0%,
		rgba(0, 0, 0, 0.1) 100%
	);
}
</style>
