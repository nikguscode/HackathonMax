# OrganizationsApi

All URIs are relative to *http://orchestrator-service:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createOrganizationQueue**](#createorganizationqueue) | **POST** /organizations/{organizationId}/queues | Create queue for organization|
|[**getOrganizationGraphics**](#getorganizationgraphics) | **GET** /organizations/{organizationId}/graphics | Get organization graphics|
|[**getOrganizationMetrics**](#getorganizationmetrics) | **GET** /organizations/{organizationId}/metrics | Get organization metrics|
|[**getOrganizationQueues**](#getorganizationqueues) | **GET** /organizations/{organizationId}/queues | Get list of queues in an organization|
|[**getOrganizationSettings**](#getorganizationsettings) | **GET** /organizations/{organizationId}/settings | Get organization settings|

# **createOrganizationQueue**
> createOrganizationQueue()


### Example

```typescript
import {
    OrganizationsApi,
    Configuration,
    QueueCreatingRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationsApi(configuration);

let organizationId: string; //Organization id (default to undefined)
let maxId: number; //Id provided by the Max massenger (default to undefined)
let maxHash: string; //Authentication hash provided by the Max massenger (default to undefined)
let queueCreatingRequest: QueueCreatingRequest; //Add user in queue (optional)

const { status, data } = await apiInstance.createOrganizationQueue(
    organizationId,
    maxId,
    maxHash,
    queueCreatingRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **queueCreatingRequest** | **QueueCreatingRequest**| Add user in queue | |
| **organizationId** | [**string**] | Organization id | defaults to undefined|
| **maxId** | [**number**] | Id provided by the Max massenger | defaults to undefined|
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
|**200** | Queue created for organization |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOrganizationGraphics**
> OrganizationGraphicsResponse getOrganizationGraphics()


### Example

```typescript
import {
    OrganizationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationsApi(configuration);

let organizationId: string; //Organization id (default to undefined)
let maxId: number; //Id provided by the Max massenger (default to undefined)
let maxHash: string; //Authentication hash provided by the Max massenger (default to undefined)

const { status, data } = await apiInstance.getOrganizationGraphics(
    organizationId,
    maxId,
    maxHash
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **organizationId** | [**string**] | Organization id | defaults to undefined|
| **maxId** | [**number**] | Id provided by the Max massenger | defaults to undefined|
| **maxHash** | [**string**] | Authentication hash provided by the Max massenger | defaults to undefined|


### Return type

**OrganizationGraphicsResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Organization graphics retrieved successfully |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOrganizationMetrics**
> OrganizationMetricsResponse getOrganizationMetrics()


### Example

```typescript
import {
    OrganizationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationsApi(configuration);

let organizationId: string; //Organization id (default to undefined)
let maxId: number; //Id provided by the Max massenger (default to undefined)
let maxHash: string; //Authentication hash provided by the Max massenger (default to undefined)

const { status, data } = await apiInstance.getOrganizationMetrics(
    organizationId,
    maxId,
    maxHash
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **organizationId** | [**string**] | Organization id | defaults to undefined|
| **maxId** | [**number**] | Id provided by the Max massenger | defaults to undefined|
| **maxHash** | [**string**] | Authentication hash provided by the Max massenger | defaults to undefined|


### Return type

**OrganizationMetricsResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Organization metrics retrieved successfully |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOrganizationQueues**
> QueueResponse getOrganizationQueues()


### Example

```typescript
import {
    OrganizationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationsApi(configuration);

let organizationId: string; //Organization id (default to undefined)
let maxId: number; //Id provided by the Max massenger (default to undefined)
let maxHash: string; //Authentication hash provided by the Max massenger (default to undefined)

const { status, data } = await apiInstance.getOrganizationQueues(
    organizationId,
    maxId,
    maxHash
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **organizationId** | [**string**] | Organization id | defaults to undefined|
| **maxId** | [**number**] | Id provided by the Max massenger | defaults to undefined|
| **maxHash** | [**string**] | Authentication hash provided by the Max massenger | defaults to undefined|


### Return type

**QueueResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Organization with its queues |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOrganizationSettings**
> OrganizationSettingsResponse getOrganizationSettings()


### Example

```typescript
import {
    OrganizationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationsApi(configuration);

let organizationId: string; //Organization id (default to undefined)
let maxId: number; //Id provided by the Max massenger (default to undefined)
let maxHash: string; //Authentication hash provided by the Max massenger (default to undefined)

const { status, data } = await apiInstance.getOrganizationSettings(
    organizationId,
    maxId,
    maxHash
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **organizationId** | [**string**] | Organization id | defaults to undefined|
| **maxId** | [**number**] | Id provided by the Max massenger | defaults to undefined|
| **maxHash** | [**string**] | Authentication hash provided by the Max massenger | defaults to undefined|


### Return type

**OrganizationSettingsResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Organization settings retrieved successfully |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

