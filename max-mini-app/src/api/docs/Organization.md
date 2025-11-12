
# Organization


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`role` | [UserRole &amp; string](UserRole &amp; string.md)
`amountOfQueues` | number

## Example

```typescript
import type { Organization } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "role": null,
  "amountOfQueues": null,
} satisfies Organization

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Organization
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


