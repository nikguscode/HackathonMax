# QueuesApi

All URIs are relative to *http://orchestrator-service:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getQueueGraphics**](QueuesApi.md#getqueuegraphics) | **GET** /queues/{queueId}/graphics | Get queue graphics |
| [**getQueueMembers**](QueuesApi.md#getqueuemembers) | **GET** /queues/{queueId}/members | Get members of a queue |
| [**getQueueMetrics**](QueuesApi.md#getqueuemetrics) | **GET** /queues/{queueId}/metrics | Get queue metrics |
| [**getQueueSettings**](QueuesApi.md#getqueuesettings) | **GET** /queues/{queueId}/settings | Get queue settings |



## getQueueGraphics

> QueueGraphicsResponse getQueueGraphics(queueId)

Get queue graphics

### Example

```ts
import {
  Configuration,
  QueuesApi,
} from '';
import type { GetQueueGraphicsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QueuesApi();

  const body = {
    // string | Queue ID
    queueId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetQueueGraphicsRequest;

  try {
    const data = await api.getQueueGraphics(body);
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
| **queueId** | `string` | Queue ID | [Defaults to `undefined`] |

### Return type

[**QueueGraphicsResponse**](QueueGraphicsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Queue graphics retrieved successfully |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getQueueMembers

> QueueMembersResponse getQueueMembers(queueId)

Get members of a queue

### Example

```ts
import {
  Configuration,
  QueuesApi,
} from '';
import type { GetQueueMembersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QueuesApi();

  const body = {
    // string
    queueId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetQueueMembersRequest;

  try {
    const data = await api.getQueueMembers(body);
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
| **queueId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**QueueMembersResponse**](QueueMembersResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Queue members retrieved successfully |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getQueueMetrics

> QueueMetricsResponse getQueueMetrics(queueId)

Get queue metrics

### Example

```ts
import {
  Configuration,
  QueuesApi,
} from '';
import type { GetQueueMetricsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QueuesApi();

  const body = {
    // string
    queueId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetQueueMetricsRequest;

  try {
    const data = await api.getQueueMetrics(body);
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
| **queueId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**QueueMetricsResponse**](QueueMetricsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Queue metrics retrieved successfully |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getQueueSettings

> QueueSettingsResponse getQueueSettings(queueId)

Get queue settings

### Example

```ts
import {
  Configuration,
  QueuesApi,
} from '';
import type { GetQueueSettingsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new QueuesApi();

  const body = {
    // string
    queueId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetQueueSettingsRequest;

  try {
    const data = await api.getQueueSettings(body);
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
| **queueId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**QueueSettingsResponse**](QueueSettingsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Queue settings retrieved successfully |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

