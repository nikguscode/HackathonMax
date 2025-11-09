# UsersApi

All URIs are relative to *http://orchestrator-service:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addUserInMaxQueueSystem**](#adduserinmaxqueuesystem) | **POST** /users | Add user in maxqueue system|
|[**getUserByMaxId**](#getuserbymaxid) | **GET** /users/{maxId} | Get user by Max Messenger ID|
|[**updateOrganizationUserRole**](#updateorganizationuserrole) | **PUT** /users/{maxId}/role | Update user role in organization|
|[**updateUserInMaxQueueSystem**](#updateuserinmaxqueuesystem) | **PUT** /users/{maxId} | Update user in maxqueue system|

# **addUserInMaxQueueSystem**
> addUserInMaxQueueSystem()


### Example

```typescript
import {
    UsersApi,
    Configuration,
    UserCreatingRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userCreatingRequest: UserCreatingRequest; //Add user in maxqueue system (optional)

const { status, data } = await apiInstance.addUserInMaxQueueSystem(
    userCreatingRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userCreatingRequest** | **UserCreatingRequest**| Add user in maxqueue system | |


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
|**200** | Successful operation |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserByMaxId**
> UserResponse getUserByMaxId()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let maxId: number; //Max Messenger user ID (default to undefined)

const { status, data } = await apiInstance.getUserByMaxId(
    maxId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **maxId** | [**number**] | Max Messenger user ID | defaults to undefined|


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

# **updateOrganizationUserRole**
> OrganizationQueuesResponse updateOrganizationUserRole()


### Example

```typescript
import {
    UsersApi,
    Configuration,
    UserRoleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let maxId: number; //User MAX ID (default to undefined)
let userRoleRequest: UserRoleRequest; //Update user role in organization (optional)

const { status, data } = await apiInstance.updateOrganizationUserRole(
    maxId,
    userRoleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userRoleRequest** | **UserRoleRequest**| Update user role in organization | |
| **maxId** | [**number**] | User MAX ID | defaults to undefined|


### Return type

**OrganizationQueuesResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Organization with its queues |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUserInMaxQueueSystem**
> updateUserInMaxQueueSystem()


### Example

```typescript
import {
    UsersApi,
    Configuration,
    UserUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let maxId: number; //Max Messenger user ID (default to undefined)
let userUpdateRequest: UserUpdateRequest; //Update user in maxqueue system (optional)

const { status, data } = await apiInstance.updateUserInMaxQueueSystem(
    maxId,
    userUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userUpdateRequest** | **UserUpdateRequest**| Update user in maxqueue system | |
| **maxId** | [**number**] | Max Messenger user ID | defaults to undefined|


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
|**200** | Successful operation |  -  |
|**400** | Invalid request parameters |  -  |
|**404** | Resource not found |  -  |
|**0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

