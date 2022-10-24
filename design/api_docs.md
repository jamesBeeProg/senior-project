# API Design Documentation

This document serves as the initial API design documentation for Splist. The API is the contract between the server and client and describes the capabilities the server is expected to accommodate.

## Permissions

Permissions allow a user to perform actions. All permissions are deny by default and must be granted using permits. Permits consist of a list of permissions they grant as well as role and channel conditions. Empty conditions means the permit applies to everyone and everywhere respectively.

Operators are special users that always have every permission regardless of permits. Additionally, certain highly-sensitive actions require Operator as a permission directly.

A role's rank is it's position in the role hierarchy. A user's rank is highest rank out of the roles the user has. Operators can only be outranked by other operators.

The following is a table of all permissions:

| Permission      | Identifier        | Notes  | Description                                    |
| --------------- | ----------------- | ------ | ---------------------------------------------- |
| Access Threads  | `access_threads`  | ------ | Client may gain information about threads      |
| Manage Threads  | `manage_threads`  | Note 1 | Client may create, modify, or delete threads   |
| Send Messages   | `send_messages`   | Note 1 | Client may send messages                       |
| Read Messages   | `read_messages`   | Note 1 | Client may receive messages and read history   |
| Manage Messages | `manage_messages` | Note 1 | Client may delete others' messages             |
| Manage Roles    | `manage_roles`    | Note 2 | Client may create, modify, or delete roles     |
| Manage Members  | `manage_members`  | Note 2 | Client may add or remove from a role's members |

1. The client must additionally have Access Threads to perform actions.
2. The client may only perform actions on things that rank below the client.

## How to Interpret

The description of each endpoint will begin with an API string. REST API routes will begin with their HTTP method followed by their path. Parameters are indicated with `{}`. WebSocket API events begin with `WS` and are followed by their event ID. Required permissions to use the endpoint are indicated with `()`. Endpoints with non-simple permission requirements are indicated with `(...)`, please check their descriptions for further details. The following are examples:

```
PATCH /resource/{id}
POST /resource (create_resource)
WS resource_update
```

## Users

### Manage User

`POST /users (operator)`
`PUT /users/{id} (operator)`
`DELETE /users/{id} (operator)`

### User Updated

`WS user_updated`

## Permits

### Manage Permit

`POST /permits (operator)`
`PUT /permits/{id} (operator)`
`DELETE /permits/{id} (operator)`

### Permit Updated

`WS permit_updated`

## Roles

### Manage Role

`POST /roles (manage_roles)`
`PUT /roles/{id} (manage_roles)`
`DELETE /roles/{id} (manage_roles)`

### Role Updated

`WS role_updated`

## Threads

### Manage Thread

`POST /threads (manage_threads)`
`PUT /threads/{id} (manage_threads)`
`DELETE /threads/{id} (manage_threads)`

### Thread Updated

`WS thread_updated (access_threads)`

Sent to clients when a thread is created, modified, or deleted. They must have access to the thread to receive this event.

### Threads Sync

`WS threads_sync`

Sent to clients when they gain or lose access to threads.

## Messages

### Get Messages

`GET /thread/{id}/messages/?before={id}&amount={amount} (read_messages)`

### Send Message

`POST /thread/{id}/messages (send_messages)`

### Modify Message

`PUT /messages/{id} (...)`

The client must be the original author of the message.

### Delete Message

`DELETE /messages/{id} (manage_messages, ...)`

`manage_messages` is not required if the client is the original author of the message.

### Message Updated

`WS message_updated (read_messages)`
