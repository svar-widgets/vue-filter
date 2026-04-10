<script setup>
defineOptions({ name: "CommentsThemesWillowDark" });

import { WillowDark } from "@svar-ui/vue-core";

const props = defineProps({
  fonts: {},
});
</script>

<template>
  <WillowDark v-if="$slots.default" :fonts="props.fonts">
    <slot />
  </WillowDark>
  <WillowDark v-else :fonts="props.fonts" />
</template>

<style>
.wx-willow-dark-theme {
	color-scheme: dark;

	--wx-filter-value-color: #ac9eff;
	--wx-filter-and-background: #fcba2e;
	--wx-filter-or-background: #77d257;
	--wx-filter-and-font-color: #000000b3;
	--wx-filter-or-font-color: #000000b3;
	--wx-filter-border: var(--wx-border);
}
</style>
