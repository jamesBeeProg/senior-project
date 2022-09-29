# API Design Documentation

This document serves as the initial API design documentation for Splist. The API is the contract between the server and client and describes the capabilities the server is expected to accommodate.

## Permissions

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

### Permissions and the Role Hierarchy

Permissions largely ignore the role hierarchy, except in these specific circumstances:

- A client may only grant members with roles that are lower than the client's highest role.
- A client may only modify roles lower than their highest role.
- A client may only modify permissions they themselves have (for both roles and channel overrides).
- A client may only modify members who's highest role is lower than the client's highest role.

Otherwise, permissions ignore the role hierarchy.

### Permission Priority

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

## Lodge

### Lodge Available

`WS lodge_available`

Sent in two scenarios:

- The client becomes a member of a new lodge.
- The client recently connected to the WebSocket API. They will receive a Lodge Available event for each lodge they are currently a member of.

The reason is included in the payload.

### Lodge Updated

`WS lodge_updated`

### Lodge Removed

`WS lodge_removed`

Client was removed from a lodge. The reason is included in the payload.

## Channel

### Create Channel

`POST /lodges/{id}/channels (manage_channels)`

### Channel Created

`WS channel_created`

### Update Channel

`PATCH /channels/{id} (manage_channels)`

### Channel Updated

`WS channel_updated`

### Delete Channel

`DELETE /channels/{id} (manage_channels)`

### Channel Deleted

`WS channel_deleted`

### Get Channel

`GET /channels/{id} (...)`

Requires at least one of `(view_text)` or `(view_topic)`. Returns general channel information as well as the channel components corresponding to the client's permissions.

## Text Components

All require `(view_text)`

### Update Text Component

`PATCH /channels/{id}/text (manage_channels)`

The component will be created if it doesn't already exist.

### Text Component Updated

`WS text_component_updated`

### Delete Text Component

`DELETE /channels/{id}/text (manage_channels)`

### Text Component Deleted

`WS text_component_deleted`

### Create Message

`POST /channels/{id}/messages (send_messages)`

### Message Created

`WS message_created (read_messages)`

### Get Channel Messages

`GET /channels/{id}/messages (read_message_history)`

### Update Message

`PATCH /channels/{id}/messages/{id}`

The client must be the author of the message to update it.

### Message Updated

`WS message_updated`

### Delete Message

`DELETE /channels/{id}/messages/{id} (manage_messages)`

### Message Deleted

`WS message_deleted`

## Topic Components

All require `(view_topic)`

### Update Topic Component

`PATCH /channels/{id}/topic (manage_channels)`

The component will be created if it doesn't already exist.

### Update Topic Component Content

`PATCH /channels/{id}/topic/content (edit_topic)`

### Topic Component Updated

`WS topic_component_updated`

### Delete Topic Component

`DELETE /channels/{id}/topic (manage_channels)`

### Topic Component Deleted

`WS topic_component_deleted`

## Roles

### Create Role

`POST /lodge/{id}/roles (manage_roles)`

### Role Created

`WS role_created`

### Update Role

`PATCH /roles/{id} (manage_roles, ...)`

The client may only modify roles that are below their highest role. The client may only modify permissions that they themselves have when modifying roles.

### Update Role Positions

`PATCH /lodge/{id}/roles (manage_roles, ...)`

The client may only modify the positions of roles that are below their highest role.

### Role Updated

`WS role_updated`

### Delete Role

`DELETE /roles/{id} (manage_roles, ...)`

### Role Deleted

`WS role_deleted`
