# StaffApi

All URIs are relative to *http://orchestrator-service:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteStaffMember**](#deletestaffmember) | **DELETE** /staff/{staffId} | Delete staff member|

# **deleteStaffMember**
> deleteStaffMember()


### Example

```typescript
import {
    StaffApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let staffId: string; //Staff ID (default to undefined)

const { status, data } = await apiInstance.deleteStaffMember(
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffId** | [**string**] | Staff ID | defaults to undefined|


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
|**200** | Staff member deleted successfully |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

