# QueueMetrics


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**waitingTime** | **number** |  | [optional] [default to undefined]
**membersInFragment** | **number** |  | [optional] [default to undefined]
**entriesInTheQueue** | **number** |  | [optional] [default to undefined]
**numberOfServedMembers** | **number** |  | [optional] [default to undefined]
**serviceTime** | **number** |  | [optional] [default to undefined]
**totalLeft** | **number** |  | [optional] [default to undefined]
**maxInQueue** | **number** |  | [optional] [default to undefined]
**minInQueue** | **number** |  | [optional] [default to undefined]
**averageInQueue** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { QueueMetrics } from './api';

const instance: QueueMetrics = {
    waitingTime,
    membersInFragment,
    entriesInTheQueue,
    numberOfServedMembers,
    serviceTime,
    totalLeft,
    maxInQueue,
    minInQueue,
    averageInQueue,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
