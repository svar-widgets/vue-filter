<script setup>
defineOptions({ name: 'FilterEditorLayout' });

import { ref, watch, onMounted, inject } from 'vue';
import {
	RichSelect,
	Text,
	Button,
	DatePicker,
	Checkbox,
	DateRangePicker,
	Combo,
} from '@svar-ui/vue-core';
import { getFilters, getFilter } from '@svar-ui/filter-store';
import { dateToString } from '@svar-ui/lib-dom';

const props = defineProps({
	fields: { default: null },
	fieldsSelector: { default: true },
	field: { default: null },
	buttons: { default: true },
	options: { default: null },
	includes: { default: null },
	type: { default: 'text' },
	filter: { default: '' },
	value: { default: '' },
	format: { default: null },
	predicate: { default: null },
	onapply: { type: Function },
	oncancel: { type: Function },
	onchange: { type: Function },
});

const locale = inject('wx-i18n');
const l = locale.getRaw();
const f = l.filter?.dateFormat || l.formats?.dateFormat;
const dateFormat = dateToString(f, l.calendar);
const _ = locale.getGroup('filter');

// signal constants for each kind of modification
const ACTION_FIELD_CHANGE = 1;
const ACTION_FILTER_CHANGE = 2;
const ACTION_VALUE_CHANGE = 4;
const ACTION_INCLUDES_CHANGE = 8;
const ACTION_TYPE_CHANGE = 16;
const ACTION_CHANGE = 32;
const ACTION_OPTIONS_CHANGE = 64;

const _filter = ref();
const _field = ref();
const _type = ref();
const _value = ref();
const _includes = ref([]);
const _options = ref();
const _format = ref();
const _predicate = ref();
const ready = ref(false);
let s = 0;

const providedOptions = ref(null);
async function loadOptions(field) {
	if (!props.options || typeof props.options !== 'function') return;

	const result = await props.options(field);
	providedOptions.value = result || [];
}

// trigger recalculation on change of incoming parameters
// include `ready` as dependency so watches fire when ready becomes true (like Svelte $effect)
watch([() => props.field, ready], ([newVal]) => {
	if (ready.value) execSignal(setState(ACTION_FIELD_CHANGE, newVal));
});
watch([() => props.type, ready], ([newVal]) => {
	if (ready.value) execSignal(setState(ACTION_TYPE_CHANGE, newVal));
});
watch([() => props.filter, ready], ([newVal]) => {
	if (ready.value) execSignal(setState(ACTION_FILTER_CHANGE, newVal));
});
watch([() => props.value, ready], ([newVal]) => {
	if (ready.value) setState(ACTION_VALUE_CHANGE, newVal);
});
watch([() => props.includes, ready], ([newVal]) => {
	if (ready.value) execSignal(setState(ACTION_INCLUDES_CHANGE, newVal));
});
watch([() => Array.isArray(props.options) ? props.options : providedOptions.value, ready], ([currOptions]) => {
	if (ready.value) execSignal(setState(ACTION_OPTIONS_CHANGE, currOptions));
});
watch([() => props.format, () => props.predicate, ready], ([newFormat, newPredicate]) => {
	if (newFormat && !props.fields) _format.value = newFormat;
	if (newPredicate && !props.fields) _predicate.value = newPredicate;
});

// delay recalculation till the component fully ready
// without it the request-options signal will be ignored
onMounted(() => {
	ready.value = true;
});

// bind new values to local vars
// store the signal for the next recalculation
const arr2str = v => (v ? v.toString() : '');
function setState(signal, value) {
	switch (signal) {
		case ACTION_FIELD_CHANGE:
			if (_field.value !== value) {
				_field.value = value;
				return signal;
			}
			break;
		case ACTION_TYPE_CHANGE:
			if (_type.value !== value) {
				_type.value = value;
				return signal;
			}
			break;
		case ACTION_FILTER_CHANGE:
			if (_filter.value !== value) {
				_filter.value = value;
				return signal;
			}
			break;
		case ACTION_VALUE_CHANGE:
			if (_value.value !== value) {
				_value.value = value;
				return signal;
			}
			break;
		case ACTION_INCLUDES_CHANGE:
			if (arr2str(_includes.value) != arr2str(value)) {
				_includes.value = value || [];
				return signal;
			}
			break;
		case ACTION_OPTIONS_CHANGE:
			if (_options.value !== value) {
				_options.value = value || [];
				return signal;
			}
			break;
	}
	return 0;
}

// collect signal values, recalculate and dispatch
let timer = null;
function execSignal(signal) {
	s = s | signal;
	if (!timer) {
		// use a delay to collect all changes from incoming parameters
		timer = setTimeout(() => {
			const v = s;
			timer = null;
			s = 0;
			runSignal(v);
		});
	}
}

const allSelected = ref();
const visibleValues = ref([]);
const rule = ref();
const rules = ref();

function runSignal(s) {
	if (s & ACTION_FIELD_CHANGE) {
		// if fields are defined, get field type
		if (props.fields) {
			_options.value = null;
			const nextField = props.fields.find(a => a.id === _field.value);
			const isDate =
				_value.value instanceof Date ||
				(_value.value && typeof _value.value === 'object');
			const isTuple = nextField.type === 'tuple' || _type.value == 'tuple';
			if (
				(isDate && nextField.type !== 'date') ||
				(!isDate && nextField.type == 'date') ||
				(isNaN(_value.value) && nextField.type == 'number') ||
				isTuple
			) {
				_value.value = null;
			} else if (
				nextField.type === 'text' &&
				typeof _value.value !== 'string'
			) {
				_value.value = _value.value || _value.value === 0 ? _value.value.toString() : '';
			}
			_format.value = nextField.format;
			_predicate.value = nextField.predicate;

			s = s | setState(ACTION_TYPE_CHANGE, nextField.type || 'text');

			loadOptions(_field.value);
		}
	}

	if (s & ACTION_TYPE_CHANGE) {
		// set list of filtering rules for current type
		rules.value = getFilters(_type.value).map(a => ({
			id: a.id,
			label: _(a.label || a.id),
		}));
		// validate if current filter is applicable for current type
		// if not, reset filter to null to trigger default filter selection
		if (!rules.value.some(r => r?.id === _filter.value)) {
			_filter.value = null;
		}
	}

	if (s & ACTION_TYPE_CHANGE || s & ACTION_FILTER_CHANGE) {
		// actualize rule
		// same id can result in different rules for different types
		rule.value = getFilter(_filter.value, _type.value);
		if (!rule.value) {
			rule.value = getFilters(_type.value).find(a => a.default);
			s = s | setState(ACTION_FILTER_CHANGE, rule.value.id);
		}

		if (
			typeof _value.value === 'object' &&
			!(_value.value instanceof Date) &&
			!rule.value.range
		) {
			s =
				s |
				setState(ACTION_VALUE_CHANGE, _type.value === 'date' ? null : '');
		}
	}

	if (
		s & ACTION_FILTER_CHANGE ||
		s & ACTION_VALUE_CHANGE ||
		s & ACTION_OPTIONS_CHANGE
	) {
		if (_options.value) {
			// build match option function
			const handler =
				_value.value || _value.value === 0
					? v => rule.value.handler(v, _value.value || '')
					: null;

			// list of matching options
			visibleValues.value =
				_filter.value && handler ? _options.value.filter(handler) : _options.value;

			// if we have list of includes, ensure that they are in the list
			let nextIncs = _includes.value;
			if (_includes.value.length) {
				nextIncs = _includes.value.filter(x => visibleValues.value.includes(x));
			}

			if (nextIncs.length) {
				// not all options in the list, update includes
				if (nextIncs.length !== _includes.value.length) {
					s = s | setState(ACTION_INCLUDES_CHANGE, nextIncs);
				}
			} else {
				// there are no includes, switch back to select all visible values
				s =
					s |
					setState(ACTION_INCLUDES_CHANGE, [...visibleValues.value]);
			}
		} else {
			visibleValues.value = [];
		}
	}

	if (s & ACTION_INCLUDES_CHANGE) {
		// correct all-selected button state
		allSelected.value = _includes.value.length === visibleValues.value.length;
	}

	if (s & ACTION_CHANGE) {
		// dispatch change signal when any of the parameters changed through UI
		const ruleObj = getRule();
		props.onchange?.({ value: ruleObj });
	}
}

// is all options checked or not
function doApply() {
	const ruleObj = getRule();
	props.onapply?.({ value: ruleObj });
}

function doCancel() {
	props.oncancel?.();
}

// select-all button clicked
function toggleAll() {
	allSelected.value = !allSelected.value;
	execSignal(
		setState(
			ACTION_INCLUDES_CHANGE,
			allSelected.value ? [...visibleValues.value] : []
		) | ACTION_CHANGE
	);
}

// click on option in the list
function handleChange(ev) {
	const { inputValue, value } = ev;

	const next = value
		? [..._includes.value, inputValue]
		: _includes.value.filter(a => a != inputValue);
	execSignal(setState(ACTION_INCLUDES_CHANGE, next) | ACTION_CHANGE);
}

// text value changed
function changeValue({ value }) {
	if (value === '$empty') value = '';
	execSignal(setState(ACTION_VALUE_CHANGE, value) | ACTION_CHANGE);
}

// different field selected
function changeField({ value }) {
	execSignal(setState(ACTION_FIELD_CHANGE, value) | ACTION_CHANGE);
}

// different filter selected
function changeFilter({ value }) {
	execSignal(setState(ACTION_FILTER_CHANGE, value) | ACTION_CHANGE);
}

// collect info and return new config object
function getRule() {
	const out = {
		filter: _filter.value,
		value: _value.value,
		type: _type.value,
	};

	if (_predicate.value) out.predicate = _predicate.value;

	if (_field.value) out.field = _field.value;

	if (
		_includes.value &&
		_includes.value.length &&
		_includes.value.length !== visibleValues.value.length
	)
		out.includes = [..._includes.value];
	else out.includes = [];

	return out;
}

function getLabel(v) {
	if (_format.value && typeof _format.value == 'function') return _format.value(v);
	if (v instanceof Date)
		return _format.value
			? dateToString(_format.value, l.calendar)(v)
			: dateFormat(v);
	return typeof v === 'string' ? v : v.toString();
}
function getComboOptions(options) {
	let arr = options
		? options.map(op => ({ id: op, label: getLabel(op) }))
		: [];
	return [{ id: '$empty', label: '', emptyLabel: _('None') }].concat(arr);
}

const input = ref();
watch([_field, input], ([fieldVal, inputVal]) => {
	if (fieldVal && inputVal) {
		setTimeout(() => {
			inputVal.querySelector('input')?.focus();
		}, 1);
	}
});
</script>

<template>
	<div class="wx-filter-editor">
		<RichSelect
			v-if="fields && fieldsSelector"
			:onchange="changeField"
			:options="fields"
			:value="_field"
		/>
		<div class="wx-wrapper">
			<div class="wx-cell">
				<RichSelect
					:onchange="changeFilter"
					:options="rules"
					:value="_filter"
					:placeholder="_('Click to select')"
				/>
			</div>
			<div ref="input" class="wx-cell">
				<template v-if="_type === 'date'">
					<DateRangePicker
						v-if="_filter == 'between' || _filter == 'notBetween'"
						:format="f"
						:value="_value"
						:buttons="['done', 'clear', 'today']"
						:onchange="changeValue"
					/>
					<DatePicker
						v-else
						:format="f"
						:value="_value"
						:onchange="changeValue"
					/>
				</template>
				<template v-else-if="_type === 'number'">
					<Text :value="_value" :onchange="changeValue" type="number" />
				</template>
				<template v-else-if="_type === 'tuple'">
					<Combo
						:value="_value"
						:options="getComboOptions(_options)"
						:onchange="changeValue"
					>
						<template #default="{ option }">
							{{ option.emptyLabel || option.label }}
						</template>
					</Combo>
				</template>
				<template v-else>
					<Text :value="_value" :onchange="changeValue" />
				</template>
			</div>
		</div>

		<Button :onclick="toggleAll">
			{{ allSelected ? _('Unselect all') : _('Select all') }}
		</Button>
		<div class="wx-list" role="listbox">
			<div
				v-for="(option, i) in visibleValues"
				:key="i"
				class="wx-item"
				:tabindex="i ? -1 : 0"
				role="option"
			>
				<Checkbox
					:label="getLabel(option)"
					:input-value="option"
					:value="_includes && _includes.includes(option)"
					:onchange="handleChange"
				/>
			</div>
		</div>

		<div v-if="buttons" class="wx-wrapper">
			<Button type="secondary" :onclick="doCancel">{{ _('Cancel') }}</Button>
			<Button type="primary" :onclick="doApply">{{ _('Apply') }}</Button>
		</div>
	</div>
</template>

<style scoped>
.wx-filter-editor {
	--wx-input-border: var(--wx-filter-border);
}
.wx-wrapper {
	display: flex;
	justify-content: right;
	gap: 10px;
	align-items: center;
	margin: 8px 0;
}

.wx-cell {
	flex: 1;
}

.wx-list {
	height: 150px;
	overflow-y: auto;
	margin: 8px 0;
	border: var(--wx-filter-border);
}

.wx-item {
	user-select: none;
	padding: 8px 12px;
	border-bottom: var(--wx-filter-border);
}

.wx-item :deep(label > span + span) {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
