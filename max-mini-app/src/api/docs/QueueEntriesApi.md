# QueueEntriesApi

All URIs are relative to *http://orchestrator-service:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteUserFromQueueEntry**](#deleteuserfromqueueentry) | **DELETE** /queue-entries/{entryId} | Delete user from queue|

# **deleteUserFromQueueEntry**
> UserResponse deleteUserFromQueueEntry()


### Example

```typescript
import {
    QueueEntriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QueueEntriesApi(configuration);

let entryId: string; //Queue Entry id (default to undefined)

const { status, data } = await apiInstance.deleteUserFromQueueEntry(
    entryId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **entryId** | [**string**] | Queue Entry id | defaults to undefined|


### Return type

**UserResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful operation |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

