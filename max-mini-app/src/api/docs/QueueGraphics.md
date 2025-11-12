
# QueueGraphics


## Properties

Name | Type
------------ | -------------
`membersInQueueByTime` | [Array&lt;QueueGraphicsMembersInQueueByTimeInner&gt;](QueueGraphicsMembersInQueueByTimeInner.md)
`averageWaitingTimeByTime` | [Array&lt;QueueGraphicsAverageWaitingTimeByTimeInner&gt;](QueueGraphicsAverageWaitingTimeByTimeInner.md)

## Example

```typescript
import type { QueueGraphics } from ''

// TODO: Update the object below with actual values
const example = {
  "membersInQueueByTime": null,
  "averageWaitingTimeByTime": null,
} satisfies QueueGraphics

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as QueueGraphics
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


