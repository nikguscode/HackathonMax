# QueueEntriesApi

All URIs are relative to *http://orchestrator-service:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addQueueEntry**](QueueEntriesApi.md#addqueueentry) | **POST** /queue-entries | Add user in queue |
| [**deleteQueueEntry**](QueueEntriesApi.md#deletequeueentry) | **DELETE** /queue-entries/{entryId} | Delete user from queue |
| [**getQueueEntry**](QueueEntriesApi.md#getqueueentry) | **GET** /queue-entries/{entryId} | Get queue entry |



## addQueueEntry

> addQueueEntry(queueEntryCreatingRequest)

Add user in queue

### Example

```ts
import {
  Configuration,
  QueueEntriesApi,
} from '';
import type { AddQueueEntryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QueueEntriesApi();

  const body = {
    // QueueEntryCreatingRequest | Add user in queue (optional)
    queueEntryCreatingRequest: ...,
  } satisfies AddQueueEntryRequest;

  try {
    const data = await api.addQueueEntry(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **queueEntryCreatingRequest** | [QueueEntryCreatingRequest](QueueEntryCreatingRequest.md) | Add user in queue | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | User added to queue |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteQueueEntry

> deleteQueueEntry(entryId)

Delete user from queue

### Example

```ts
import {
  Configuration,
  QueueEntriesApi,
} from '';
import type { DeleteQueueEntryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QueueEntriesApi();

  const body = {
    // string | Queue Entry id
    entryId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteQueueEntryRequest;

  try {
    const data = await api.deleteQueueEntry(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **entryId** | `string` | Queue Entry id | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful operation |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getQueueEntry

> QueueEntryResponse getQueueEntry(entryId)

Get queue entry

### Example

```ts
import {
  Configuration,
  QueueEntriesApi,
} from '';
import type { GetQueueEntryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QueueEntriesApi();

  const body = {
    // string | Queue Entry id
    entryId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetQueueEntryRequest;

  try {
    const data = await api.getQueueEntry(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **entryId** | `string` | Queue Entry id | [Defaults to `undefined`] |

### Return type

[**QueueEntryResponse**](QueueEntryResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful operation |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

