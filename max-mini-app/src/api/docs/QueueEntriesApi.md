# QueueEntriesApi

All URIs are relative to *http://orchestrator-service:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addQueueEntry**](#addqueueentry) | **POST** /queue-entries | Add user in queue|
|[**deleteQueueEntry**](#deletequeueentry) | **DELETE** /queue-entries/{entryId} | Delete user from queue|
|[**getQueueEntry**](#getqueueentry) | **GET** /queue-entries/{entryId} | Get queue entry|

# **addQueueEntry**
> addQueueEntry()


### Example

```typescript
import {
    QueueEntriesApi,
    Configuration,
    QueueEntryCreatingRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new QueueEntriesApi(configuration);

let authId: string; //Auth Id provided by orchestrator service (default to undefined)
let maxHash: string; //Authentication hash provided by the Max massenger (default to undefined)
let queueEntryCreatingRequest: QueueEntryCreatingRequest; //Add user in queue (optional)

const { status, data } = await apiInstance.addQueueEntry(
    authId,
    maxHash,
    queueEntryCreatingRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **queueEntryCreatingRequest** | **QueueEntryCreatingRequest**| Add user in queue | |
| **authId** | [**string**] | Auth Id provided by orchestrator service | defaults to undefined|
| **maxHash** | [**string**] | Authentication hash provided by the Max massenger | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | User added to queue |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteQueueEntry**
> deleteQueueEntry()


### Example

```typescript
import {
    QueueEntriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QueueEntriesApi(configuration);

let entryId: string; //Queue Entry id (default to undefined)
let authId: string; //Auth Id provided by orchestrator service (default to undefined)
let maxHash: string; //Authentication hash provided by the Max massenger (default to undefined)

const { status, data } = await apiInstance.deleteQueueEntry(
    entryId,
    authId,
    maxHash
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **entryId** | [**string**] | Queue Entry id | defaults to undefined|
| **authId** | [**string**] | Auth Id provided by orchestrator service | defaults to undefined|
| **maxHash** | [**string**] | Authentication hash provided by the Max massenger | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful operation |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getQueueEntry**
> QueueEntryResponse getQueueEntry()


### Example

```typescript
import {
    QueueEntriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QueueEntriesApi(configuration);

let entryId: string; //Queue Entry id (default to undefined)
let authId: string; //Auth Id provided by orchestrator service (default to undefined)
let maxHash: string; //Authentication hash provided by the Max massenger (default to undefined)

const { status, data } = await apiInstance.getQueueEntry(
    entryId,
    authId,
    maxHash
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **entryId** | [**string**] | Queue Entry id | defaults to undefined|
| **authId** | [**string**] | Auth Id provided by orchestrator service | defaults to undefined|
| **maxHash** | [**string**] | Authentication hash provided by the Max massenger | defaults to undefined|


### Return type

**QueueEntryResponse**

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

