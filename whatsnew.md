## 2.6.2

### Fixes

- An error in the console when the editor closes right after opening
- The package doesn't declare its `@svar/lib-svelte` dependency
- Optional props of FilterBuilder, FilterEditor and FilterBar are required in the type definitions
- FilterEditor `oncancel` is typed with an argument it never receives
- FilterBuilder methods available via `bind:this` are missing in the type definitions
- The type definitions list store exports that can't be imported from the widget at runtime
- Range values of `between` and `notBetween` rules don't match the `IFilter` type
- `createFilter`, `createArrayFilter` and `createFilterRule` types don't allow the `null` they can return

## 2.6.1

-   Using Vue Core 2.6.1

## 2.6.0

### Fixes

- FilterBuilder with line type throws error when in container
- FilterEditor popup is closed when selecting another rule from a dropdown

## 2.5.0

### Initial features

Provides all the same functionality as Svelte Filter 2.5.0
