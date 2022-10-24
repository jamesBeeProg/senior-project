# API Design Documentation

This document serves as the initial API design documentation for Splist. The API is the contract between the server and client and describes the capabilities the server is expected to accommodate.

## Permissions (outdated?)

| Permission           | Value      |
| -------------------- | ---------- |
| Manage Channels      | `(1 << 1)` |
| View Text            | `(1 << 2)` |
| Send Messages        | `(1 << 3)` |
| Read Messages        | `(1 << 4)` |
| Read Message History | `(1 << 5)` |
| Manage Messages      | `(1 << 6)` |
| View Topic           | `(1 << 7)` |
| Edit Topic           | `(1 << 8)` |
| Manage Roles         | `(1 << 9)` |

### Permissions and the Role Hierarchy (outdated?)

Permissions largely ignore the role hierarchy, except in these specific circumstances:

- A client may only grant members with roles that are lower than the client's highest role.
- A client may only modify roles lower than their highest role.
- A client may only modify permissions they themselves have (for both roles and channel overrides).
- A client may only modify members who's highest role is lower than the client's highest role.

Otherwise, permissions ignore the role hierarchy.

### Permission Priority (outdated?)

There may be a case where a member would have conflicting permissions. In that case, permissions are calculated in the following order:

- Permissions allowed by a member's role
- Permissions denied by a channel override
- Permissions allowed by a channel override

The following pseudoscope demonstrates this:

```py
def compute_permissions(member):
    permissions = 0

    for role in member.roles:
        permissions |= role.permissions

    return permissions

def compute_overrides(member, channel):
    permissions = compute_permissions(member)
    allow = 0
    deny = 0

    for role in member.roles:
        override = channel.overrides[role]
        if override:
            allow |= override.allow
            deny |= override.deny

    permissions &= ~deny
    permissions |= allow

    return permissions
```

## How to Interpret

The following documentation after this section will consist of the various API endpoints and their descriptions. Each endpoint consists of a title, an API string, and optionally further description. They are grouped into larger categories to help with viewing. Use this section to understand how to interpret the API endpoints.

The description of each endpoint will begin with an API string. REST API routes will begin with their HTTP method followed by their path. Parameters are indicated with `{}`. WebSocket API events begin with `WS` and are followed by their event ID. Required permissions to use the endpoint are indicated with `()`. Endpoints with non-simple permission requirements are indicated with `(...)`, please check their descriptions for further details. The following are examples:

```
PATCH /resource/{id}
POST /resource (create_resource)
WS resource_update
```

## Users

### Manage User

`POST /users/{id}`
`PUT /users/{id}`
`DELETE /users/{id}`

### User Updated

`WS user_updated`

## Permit

### Manage Permit

`POST /permits/{id}`
`PUT /permits/{id}`
`DELETE /permits/{id}`

### Permit Updated

`WS permit_updated`

## Role

### Manage Role

`POST /roles/{id}`
`PUT /roles/{id}`
`DELETE /roles/{id}`

### Role Updated

`WS role_updated`

## Thread

### Manage Thread

`POST /threads/{id}`
`PUT /threads/{id}`
`DELETE /threads/{id}`

### Thread Updated

`WS thread_updated`

### Threads Sync

`WS threads_sync`

## Message

### Get Messages

`GET /messages/{id}/before?limit={limit}`

### Manage Message

`POST /messages/{id}`
`PUT /messages/{id}`
`DELETE /messages/{id}`

### Message Updated

`WS message_updated`
