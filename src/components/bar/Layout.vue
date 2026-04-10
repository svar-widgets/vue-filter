<script setup>
defineOptions({ name: 'FilterBarLayout' });

import { ref, computed, watch, inject } from 'vue';
import {
	RichSelect,
	Text,
	DatePicker,
	DateRangePicker,
} from '@svar-ui/vue-core';
import { createFilterRule } from '@svar-ui/filter-store';

const props = defineProps({
	fields: { default: () => [] },
	debounce: { default: 300 },
	onchange: { type: Function },
});

const lastField = ref();
const timer = ref();
const lastValue = ref({});

const locale = inject('wx-i18n');
const l = locale.getRaw();
const f = l.filter?.dateFormat || l.formats?.dateFormat;
const _ = locale.getGroup('filter');

const normalizedFields = computed(() => normalizeFields(props.fields));

watch(normalizedFields, () => {
	// prepare lastField and lastValue
	const values = {};
	normalizedFields.value.forEach(field => {
		if (field.type === 'dynamic') {
			field.by.forEach(f => {
				if (typeof f.value !== 'undefined')
					values[f.id] = f.value;
			});
			lastField.value = field.by[0].id;
		} else if (field.type === 'all') {
			values[field.type] = field.value ?? '';
		} else if (typeof field.value !== 'undefined') {
			values[field.id] = field.value;
		}
	});
	lastValue.value = values;
}, { immediate: true, flush: 'pre' });

const filters = computed(() => {
	return normalizedFields.value.map(field => {
		let base = {
			field: field.type,
			label: field.label,
			placeholder: field.placeholder,
		};

		if (field.type === 'dynamic') {
			base.dynamicField = true;
			base.field = lastField.value;

			const currentField = field.by.find(f => f.id === base.field);
			if (currentField) {
				base = {
					...base,
					...currentField,
				};
			}
		} else if (field.type !== 'all') {
			base = { ...base, ...field, field: field.id };
		}

		if (field.by) base.optionsBy = getDynamicOptions(field.by);
		base.value = lastValue.value[base.field];

		return { type: 'text', filter: 'contains', ...base };
	});
});

function updateValue(value, field, delay) {
	lastValue.value[field] = value === '$empty' ? '' : value;

	dispatchChange(delay);
}

function updateFiltersField(value) {
	if (lastField.value !== value) {
		if (lastField.value) {
			lastValue.value = { ...lastValue.value, [lastField.value]: '' };
		}
		lastField.value = value;
	}

	dispatchChange();
}

function dispatchChange(delay) {
	if (timer.value) clearTimeout(timer.value);
	timer.value = setTimeout(() => {
		props.onchange?.({ value: getRules() });
	}, delay || props.debounce);
}

function getRules() {
	const rules = filters.value.map(f => getRule(f)).filter(a => !!a);
	if (rules.length === 1 && rules[0]?.glue === 'or') return rules[0];
	return {
		glue: 'and',
		rules,
	};
}

function getRule(filter) {
	if (filter.field === 'all')
		return createFilterRule(
			filter.optionsBy,
			'contains',
			lastValue.value[filter.field]
		);
	const value = lastValue.value[filter.field];
	if (!value) return null;

	return {
		field: filter.field,
		filter: filter.filter,
		type: filter.type,
		value,
	};
}

function normalizeFields(fields) {
	return fields.map(field => {
		if (field.type === 'all' || field.type === 'dynamic') {
			return {
				...field,
				by: field.by.map(b => normalizeField(b)),
			};
		}
		return normalizeField(field);
	});
}

function normalizeField(field) {
	if (typeof field === 'string')
		return { id: field, type: 'text', filter: 'contains' };
	return {
		...field,
		filter: field.filter || (field.options ? 'equal' : 'contains'),
		options:
			field.type !== 'date' &&
			field.options &&
			getFieldOptions(field),
	};
}

function getFieldOptions(field) {
	const options = field.options.map(a => {
		if (typeof a === 'string' || typeof a === 'number') {
			return { id: a, label: a };
		}
		return a;
	});

	options.unshift({ id: '$empty', label: _('None') });

	return options;
}

function getDynamicOptions(arr) {
	return arr.map(a => ({ id: a.id, label: a.id }));
}
</script>

<template>
	<div class="wx-filter-bar">
		<template v-for="(filter, i) in filters" :key="i">
			<div v-if="filter.label" class="wx-label">
				{{ filter.label }}
			</div>
			<div v-if="filter.dynamicField" class="wx-select">
				<RichSelect
					:value="filter.field"
					:options="filter.optionsBy"
					:onchange="({ value }) => updateFiltersField(value, i)"
				/>
			</div>
			<template v-if="filter.options">
				<div class="wx-select">
					<RichSelect
						:value="filter.value"
						:placeholder="filter.placeholder ?? `${_('filter by')} ${filter.field}`"
						:options="filter.options"
						:onchange="({ value }) => updateValue(value, filter.field, 1)"
					/>
				</div>
			</template>
			<template v-else-if="filter.type === 'text' || filter.type === 'number'">
				<div class="wx-text">
					<Text
						:value="filter.value"
						:placeholder="filter.placeholder ?? `${_('filter by')} ${filter.field} (${_(filter.filter)})`"
						:onchange="({ value, input }) => {
							if (input) updateValue(value, filter.field, 0);
						}"
						:type="filter.type"
					/>
				</div>
			</template>
			<template v-else-if="filter.type === 'date'">
				<div class="wx-date">
					<DateRangePicker
						v-if="filter.filter === 'between' || filter.filter === 'notBetween'"
						:value="filter.value"
						:format="f"
						:buttons="['done', 'clear', 'today']"
						:placeholder="filter.placeholder ?? `${_('filter by')} ${filter.field} (${_(filter.filter)})`"
						:onchange="({ value }) => updateValue(value, filter.field, 1)"
					/>
					<DatePicker
						v-else
						:value="filter.value"
						:format="f"
						:placeholder="filter.placeholder ?? `${_('filter by')} ${filter.field} (${_(filter.filter)})`"
						:onchange="({ value }) => updateValue(value, filter.field, 1)"
					/>
				</div>
			</template>
		</template>
	</div>
</template>

<style scoped>
.wx-filter-bar {
	display: flex;
	padding: 14px 2px;
	width: 610px;
	gap: 10px;
}

.wx-label {
	font-family: var(--wx-label-font-family);
	font-size: var(--wx-label-font-size);
	line-height: var(--wx-label-line-height);
	font-weight: var(--wx-label-font-weight);
	color: var(--wx-label-font-color);
	align-content: center;
	max-width: 160px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.wx-select {
	flex: 1;
}

.wx-text,
.wx-date {
	flex: 2;
}
</style>
