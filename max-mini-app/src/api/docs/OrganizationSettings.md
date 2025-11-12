
# OrganizationSettings


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`description` | string
`address` | string
`isBanned` | boolean
`createdAt` | Date

## Example

```typescript
import type { OrganizationSettings } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "description": null,
  "address": null,
  "isBanned": null,
  "createdAt": null,
} satisfies OrganizationSettings

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizationSettings
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


