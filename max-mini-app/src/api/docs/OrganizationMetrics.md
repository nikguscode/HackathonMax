
# OrganizationMetrics


## Properties

Name | Type
------------ | -------------
`numberOfActiveQueues` | number
`numberOfQueues` | number
`numberOfMembersInAllQueues` | number
`numberOfEmployees` | number
`membersInDay` | number
`waitingTime` | number
`averageLoadInQueues` | number
`numberOfServedMembers` | number

## Example

```typescript
import type { OrganizationMetrics } from ''

// TODO: Update the object below with actual values
const example = {
  "numberOfActiveQueues": null,
  "numberOfQueues": null,
  "numberOfMembersInAllQueues": null,
  "numberOfEmployees": null,
  "membersInDay": null,
  "waitingTime": null,
  "averageLoadInQueues": null,
  "numberOfServedMembers": null,
} satisfies OrganizationMetrics

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrganizationMetrics
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


