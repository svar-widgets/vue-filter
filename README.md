<div align="center">

# SVAR Vue Filter | Query Builder

[![npm](https://img.shields.io/npm/v/@svar-ui/vue-filter.svg)](https://www.npmjs.com/package/@svar-ui/vue-filter)
[![License](https://img.shields.io/github/license/svar-widgets/vue-filter)](https://github.com/svar-widgets/vue-filter/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/@svar-ui/vue-filter.svg)](https://www.npmjs.com/package/@svar-ui/vue-filter)

</div>

<div align="center">

[Homepage](https://svar.dev/vue/filter/) • [Documentation](https://docs.svar.dev/vue/filter/filter-main-overview) • [Demos](https://docs.svar.dev/vue/filter/samples/)

</div>

[SVAR Vue Filter](https://svar.dev/vue/filter/) is a Vue 3 library that helps you add filtering capabilities to your Vue apps: from simple filter bars to advanced query builders and natural language search. 

<div align="center">

<img src="https://svar.dev/images/github/github_filter.png" alt="SVAR Filter - Vue Query Builder Component" style="width: 700px;">

</div>

### :jigsaw: Included Components

The package includes 4 components:

-   **FilterBuilder** - the main component that provides an interactive interface for building complex queries and filtering large datasets.
-   **FilterEditor** - allows you to create a filtering rule for a single field, and can be used standalone.
-   **FilterBar** - a simplified filter bar UI with inputs and select controls. It allows building filtering rules for several fields and combining them with logical operators.
-   **FilterQuery** - a YouTrack-like input for typing structured filter queries, with optional natural language mode for processing free-text queries

### :sparkles: Key features:

-   Covers multiple use cases: from simple filter inputs to full query builders and text-based search.
-   Complex filter queries: multi-field rules, groups of filters, nested filters, AND/OR logic.
-   Multiple data types: text, number, and date filtering with type-specific operators.
-   Configurable layouts: vertical, horizontal, or minimal filter bar layouts.
-   Localization: labels and date formats can be customized to match users' locale.
-   Dynamic loading: filter options can be loaded on demand when a new filter is added.
-   JSON output: the component outputs structured JSON that can be transformed into SQL or other query formats.
-   Intuitive, straightforward API: easily set and retrieve values, customize filters, and track changes.
-   Full TypeScript support with complete type definitions.

[Check out the demos](https://docs.svar.dev/vue/filter/samples/#/base/willow) to see all SVAR Vue Filter components in action.

### :hammer_and_wrench: How to Use

You can install SVAR Vue Filter library as follows:

```
npm install @svar-ui/vue-filter
```

To use each component, simply import the SVAR Vue Filter package and include the needed component in your Vue file:

```vue
<script setup>
import { FilterBuilder } from "@svar-ui/vue-filter";

const fields = [
    { id: "first_name", label: "Name", type: "text" },
    { id: "age", label: "Age", type: "number" }
];
const options = {
    first_name: ["Alex", "Marta", "Claire", "David"],
    age: [21, 25, 28, 35, 42, 51, 53]
};
</script>

<template>
  <FilterBuilder :fields="fields" :options="options" />
</template>
```

For further instructions, see the detailed [Getting started guide](https://docs.svar.dev/vue/filter/getting_started).

### :speech_balloon: Need Help?

[Post an Issue](https://github.com/svar-widgets/vue-filter/issues/) or use our [community forum](https://forum.svar.dev).
