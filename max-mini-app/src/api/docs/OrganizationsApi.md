# OrganizationsApi

All URIs are relative to *http://orchestrator-service:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getOrganizationGraphics**](OrganizationsApi.md#getorganizationgraphics) | **GET** /organizations/{organizationId}/graphics | Get organization graphics |
| [**getOrganizationMetrics**](OrganizationsApi.md#getorganizationmetrics) | **GET** /organizations/{organizationId}/metrics | Get organization metrics |
| [**getOrganizationSettings**](OrganizationsApi.md#getorganizationsettings) | **GET** /organizations/{organizationId}/settings | Get organization settings |



## getOrganizationGraphics

> OrganizationGraphicsResponse getOrganizationGraphics(organizationId)

Get organization graphics

### Example

```ts
import {
  Configuration,
  OrganizationsApi,
} from '';
import type { GetOrganizationGraphicsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OrganizationsApi();

  const body = {
    // string | Organization ID
    organizationId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetOrganizationGraphicsRequest;

  try {
    const data = await api.getOrganizationGraphics(body);
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
| **organizationId** | `string` | Organization ID | [Defaults to `undefined`] |

### Return type

[**OrganizationGraphicsResponse**](OrganizationGraphicsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Organization graphics retrieved successfully |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getOrganizationMetrics

> OrganizationMetricsResponse getOrganizationMetrics(organizationId)

Get organization metrics

### Example

```ts
import {
  Configuration,
  OrganizationsApi,
} from '';
import type { GetOrganizationMetricsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OrganizationsApi();

  const body = {
    // string | Organization ID
    organizationId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetOrganizationMetricsRequest;

  try {
    const data = await api.getOrganizationMetrics(body);
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
| **organizationId** | `string` | Organization ID | [Defaults to `undefined`] |

### Return type

[**OrganizationMetricsResponse**](OrganizationMetricsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Organization metrics retrieved successfully |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getOrganizationSettings

> OrganizationSettingsResponse getOrganizationSettings(organizationId)

Get organization settings

### Example

```ts
import {
  Configuration,
  OrganizationsApi,
} from '';
import type { GetOrganizationSettingsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OrganizationsApi();

  const body = {
    // string | Organization ID
    organizationId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetOrganizationSettingsRequest;

  try {
    const data = await api.getOrganizationSettings(body);
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
| **organizationId** | `string` | Organization ID | [Defaults to `undefined`] |

### Return type

[**OrganizationSettingsResponse**](OrganizationSettingsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Organization settings retrieved successfully |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

