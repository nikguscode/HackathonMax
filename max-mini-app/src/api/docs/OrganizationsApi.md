# OrganizationsApi

All URIs are relative to *http://orchestrator-service:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getOrganizationMetrics**](#getorganizationmetrics) | **GET** /organizations/{organizationId}/metrics | Get organization metrics|
|[**getOrganizationQueues**](#getorganizationqueues) | **GET** /organizations/{organizationId}/queues | Get list of queues in an organization|
|[**getOrganizationSettings**](#getorganizationsettings) | **GET** /organizations/{organizationId}/settings | Get organization settings|

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

let organizationId: string; //Organization ID (default to undefined)

const { status, data } = await apiInstance.getOrganizationMetrics(
    organizationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **organizationId** | [**string**] | Organization ID | defaults to undefined|


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
> OrganizationQueuesResponse getOrganizationQueues()


### Example

```typescript
import {
    OrganizationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationsApi(configuration);

let organizationId: string; //Organization ID (default to undefined)

const { status, data } = await apiInstance.getOrganizationQueues(
    organizationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **organizationId** | [**string**] | Organization ID | defaults to undefined|


### Return type

**OrganizationQueuesResponse**

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

let organizationId: string; //Organization ID (default to undefined)

const { status, data } = await apiInstance.getOrganizationSettings(
    organizationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **organizationId** | [**string**] | Organization ID | defaults to undefined|


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

