
# QueueMetrics


## Properties

Name | Type
------------ | -------------
`waitingTime` | number
`entriesInTheQueue` | number
`numberOfServedMembers` | number
`serviceTime` | number
`totalLeft` | number
`maxInQueue` | number
`minInQueue` | number
`averageInQueue` | number

## Example

```typescript
import type { QueueMetrics } from ''

// TODO: Update the object below with actual values
const example = {
  "waitingTime": null,
  "entriesInTheQueue": null,
  "numberOfServedMembers": null,
  "serviceTime": null,
  "totalLeft": null,
  "maxInQueue": null,
  "minInQueue": null,
  "averageInQueue": null,
} satisfies QueueMetrics

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as QueueMetrics
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


