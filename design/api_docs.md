# API Design Documentation

This document serves as the initial API design documentation for Splist. The API is the contract between the server and client and describes the capabilities the server is expected to accommodate.

## Permissions

| Permission     | Value             | Notes  | Description                                   |
| -------------- | ----------------- | ------ | --------------------------------------------- |
| Access Threads | `access_threads`  | ---    | Client gains information about threads        |
| Manage Threads | `manage_threads`  | Note 1 | Client can create, modify, and delete threads |
| Send Messages  | `send_messages`   | Note 1 | Client can send messages                      |
| Read Messages  | `read_messages`   | Note 1 | Client can read message history               |
| Manage Message | `manage_messages` | Note 1 | Client can delete messages                    |
| Manage Roles   | `manage_roles`    | Note 2 | Client can create, modify, and delete roles   |
| Manage Members | `manage_members`  | Note 2 | Client can add or remove a user to a role     |

Notes:

1. The client must additionally have Access Threads in the context for the permission to take effect.
2. The client can only do these actions on entities that rank below the client.

### Rank Terminology

Here is what the term "rank" means in regards to the following entities:

- Roles: The role's position in the role hierarchy.
- Users: The position of the highest role the user is a member of.
- Operator Users: Can only be outranked by other operators.

### Operators

Operators are special users that always have every permission regardless of permits. Additionally, they can perform actions that regular permissions couldn't grant.

## How to Interpret

The description of each endpoint will begin with an API string. REST API routes will begin with their HTTP method followed by their path. Parameters are indicated with `{}`. WebSocket API events begin with `WS` and are followed by their event ID. Required permissions to use the endpoint are indicated with `()`. Endpoints with non-simple permission requirements are indicated with `(...)`, please check their descriptions for further details. The following are examples:

```
PATCH /resource/{id}
POST /resource (create_resource)
WS resource_update
```

## Users

### Manage User

`POST /users/{id} (operator)`
`PUT /users/{id} (operator)`
`DELETE /users/{id} (operator)`

### User Updated

`WS user_updated`

## Permit

### Manage Permit

`POST /permits/{id} (operator)`
`PUT /permits/{id} (operator)`
`DELETE /permits/{id} (operator)`

### Permit Updated

`WS permit_updated`

## Role

### Manage Role

`POST /roles/{id} (manage_roles)`
`PUT /roles/{id} (manage_roles)`
`DELETE /roles/{id} (manage_roles)`

### Role Updated

`WS role_updated`

## Thread

### Manage Thread

`POST /threads/{id} (manage_threads)`
`PUT /threads/{id} (manage_threads)`
`DELETE /threads/{id} (manage_threads)`

### Thread Updated

`WS thread_updated (access_threads)`

Sent to clients when a thread is created, modified, or deleted. They must have access to the thread to receive this event.

### Threads Sync

`WS threads_sync`

Sent to clients when they gain or lose access to threads.

## Message

### Get Messages

`GET /messages/{id}/before?limit={limit} (read_messages)`

### Send Message

`POST /messages/{id} (send_messages)`

### Modify Message

`PUT /messages/{id} (...)`

The client must be the original author of the message.

### Delete Message

`DELETE /messages/{id} (manage_messages, ...)`

`manage_messages` is not required if the client is the original author of the message.

### Message Updated

`WS message_updated`
