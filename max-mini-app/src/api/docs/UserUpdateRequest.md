
# UserUpdateRequest


## Properties

Name | Type
------------ | -------------
`username` | string
`firstName` | string
`secondName` | string
`createdAt` | Date

## Example

```typescript
import type { UserUpdateRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "username": null,
  "firstName": null,
  "secondName": null,
  "createdAt": null,
} satisfies UserUpdateRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserUpdateRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


