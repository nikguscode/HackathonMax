# UsersApi

All URIs are relative to *http://orchestrator-service:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addUserInMaxQueueSystem**](UsersApi.md#adduserinmaxqueuesystem) | **POST** /users | Add user in maxqueue system |
| [**getUserByMaxId**](UsersApi.md#getuserbymaxid) | **GET** /users/{maxId} | Get user by Max Messenger ID |
| [**sendUserMiniAppData**](UsersApi.md#senduserminiappdataoperation) | **POST** /users/{maxId}/mini-app | Transfer data after opening the mini-app |
| [**updateOrganizationUserRole**](UsersApi.md#updateorganizationuserrole) | **PUT** /users/{maxId}/role | Update user role in organization |
| [**updateUserInMaxQueueSystem**](UsersApi.md#updateuserinmaxqueuesystem) | **PUT** /users/{maxId} | Update user in maxqueue system |



## addUserInMaxQueueSystem

> addUserInMaxQueueSystem(userCreatingRequest)

Add user in maxqueue system

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { AddUserInMaxQueueSystemRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // UserCreatingRequest | Add user in maxqueue system (optional)
    userCreatingRequest: ...,
  } satisfies AddUserInMaxQueueSystemRequest;

  try {
    const data = await api.addUserInMaxQueueSystem(body);
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
| **userCreatingRequest** | [UserCreatingRequest](UserCreatingRequest.md) | Add user in maxqueue system | [Optional] |

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
| **200** | Successful operation |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getUserByMaxId

> UserResponse getUserByMaxId(maxId)

Get user by Max Messenger ID

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { GetUserByMaxIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // number | Max Messenger user ID
    maxId: 789,
  } satisfies GetUserByMaxIdRequest;

  try {
    const data = await api.getUserByMaxId(body);
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
| **maxId** | `number` | Max Messenger user ID | [Defaults to `undefined`] |

### Return type

[**UserResponse**](UserResponse.md)

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


## sendUserMiniAppData

> sendUserMiniAppData(maxId, sendUserMiniAppDataRequest)

Transfer data after opening the mini-app

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { SendUserMiniAppDataOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // number | User MAX ID
    maxId: 789,
    // SendUserMiniAppDataRequest | Transfer data after opening the mini-app (optional)
    sendUserMiniAppDataRequest: ...,
  } satisfies SendUserMiniAppDataOperationRequest;

  try {
    const data = await api.sendUserMiniAppData(body);
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
| **maxId** | `number` | User MAX ID | [Defaults to `undefined`] |
| **sendUserMiniAppDataRequest** | [SendUserMiniAppDataRequest](SendUserMiniAppDataRequest.md) | Transfer data after opening the mini-app | [Optional] |

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
| **200** | Successful operation |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateOrganizationUserRole

> OrganizationQueuesResponse updateOrganizationUserRole(maxId, userRoleRequest)

Update user role in organization

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UpdateOrganizationUserRoleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // number | User MAX ID
    maxId: 789,
    // UserRoleRequest | Update user role in organization (optional)
    userRoleRequest: ...,
  } satisfies UpdateOrganizationUserRoleRequest;

  try {
    const data = await api.updateOrganizationUserRole(body);
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
| **maxId** | `number` | User MAX ID | [Defaults to `undefined`] |
| **userRoleRequest** | [UserRoleRequest](UserRoleRequest.md) | Update user role in organization | [Optional] |

### Return type

[**OrganizationQueuesResponse**](OrganizationQueuesResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Organization with its queues |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateUserInMaxQueueSystem

> updateUserInMaxQueueSystem(maxId, userUpdateRequest)

Update user in maxqueue system

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UpdateUserInMaxQueueSystemRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // number | Max Messenger user ID
    maxId: 789,
    // UserUpdateRequest | Update user in maxqueue system (optional)
    userUpdateRequest: ...,
  } satisfies UpdateUserInMaxQueueSystemRequest;

  try {
    const data = await api.updateUserInMaxQueueSystem(body);
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
| **maxId** | `number` | Max Messenger user ID | [Defaults to `undefined`] |
| **userUpdateRequest** | [UserUpdateRequest](UserUpdateRequest.md) | Update user in maxqueue system | [Optional] |

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
| **200** | Successful operation |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | Resource not found |  -  |
| **0** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

