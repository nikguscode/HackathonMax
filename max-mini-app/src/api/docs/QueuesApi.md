# QueuesApi

All URIs are relative to *http://orchestrator-service:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getQueueGraphics**](#getqueuegraphics) | **GET** /queues/{queueId}/graphics | Get queue graphics|
|[**getQueueMembers**](#getqueuemembers) | **GET** /queues/{queueId}/members | Get members of a queue|
|[**getQueueMetrics**](#getqueuemetrics) | **GET** /queues/{queueId}/metrics | Get queue metrics|
|[**getQueueSettings**](#getqueuesettings) | **GET** /queues/{queueId}/settings | Get queue settings|
|[**getQueueStaff**](#getqueuestaff) | **GET** /queues/{queueId}/staff | Get staff member of a queue|

# **getQueueGraphics**
> QueueGraphicsResponse getQueueGraphics()


### Example

```typescript
import {
    QueuesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QueuesApi(configuration);

let queueId: string; //Queue ID (default to undefined)

const { status, data } = await apiInstance.getQueueGraphics(
    queueId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **queueId** | [**string**] | Queue ID | defaults to undefined|


### Return type

**QueueGraphicsResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Queue graphics retrieved successfully |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getQueueMembers**
> QueueMembersResponse getQueueMembers()


### Example

```typescript
import {
    QueuesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QueuesApi(configuration);

let queueId: string; // (default to undefined)

const { status, data } = await apiInstance.getQueueMembers(
    queueId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **queueId** | [**string**] |  | defaults to undefined|


### Return type

**QueueMembersResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Queue members retrieved successfully |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getQueueMetrics**
> QueueMetricsResponse getQueueMetrics()


### Example

```typescript
import {
    QueuesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QueuesApi(configuration);

let queueId: string; // (default to undefined)

const { status, data } = await apiInstance.getQueueMetrics(
    queueId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **queueId** | [**string**] |  | defaults to undefined|


### Return type

**QueueMetricsResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Queue metrics retrieved successfully |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getQueueSettings**
> QueueSettingsResponse getQueueSettings()


### Example

```typescript
import {
    QueuesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QueuesApi(configuration);

let queueId: string; // (default to undefined)

const { status, data } = await apiInstance.getQueueSettings(
    queueId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **queueId** | [**string**] |  | defaults to undefined|


### Return type

**QueueSettingsResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Queue settings retrieved successfully |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getQueueStaff**
> QueueStaffResponse getQueueStaff()


### Example

```typescript
import {
    QueuesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QueuesApi(configuration);

let queueId: string; //Queue ID (default to undefined)

const { status, data } = await apiInstance.getQueueStaff(
    queueId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **queueId** | [**string**] | Queue ID | defaults to undefined|


### Return type

**QueueStaffResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Queue staff retrieved successfully |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

