# API Design Documentation

This document serves as the initial API design documentation for Splist. The API is the contract between the server and client and describes the capabilities the server is expected to accommodate.

## Permissions

TODO describe how final permissions are calculated

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

## How to Interpret

The following documentation after this section will consist of the various API endpoints and their descriptions. Each endpoint consists of a title, an API string, and optionally further description. They are grouped into larger categories to help with viewing. Use this section to understand how to interpret the API endpoints.

The description of each endpoint will begin with an API string. REST API routes will begin with their HTTP method followed by their path. Parameters are indicated with `{}`. WebSocket API events begin with `WS` and are followed by their event ID. Required permissions to use the endpoint are indicated with `()`. Endpoints with non-simple permission requirements are indicated with `(...)`, please check their descriptions for further details. The following are examples:

```
PUT /resource/{id}
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

`PUT /channels/{id}/text (manage_channels)`

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

`PUT /channels/{id}/messages/{id}`

You must be the author of the message to update it.

### Message Updated

`WS message_updated`

### Delete Message

`DELETE /channels/{id}/messages/{id} (manage_messages)`

### Message Deleted

`WS message_deleted`

## Topic Components

All require `(view_topic)`

### Update Topic Component

`PUT /channels/{id}/topic (...)`

Clients with only `(edit_topic)` may only update fields relating to the content.

The client must have `(manage_channels)` to update all other fields. The component will be created if it doesn't already exist.

### Update Topic Component Content

`PUT /channels/{id}/topic (edit_topic)`

### Topic Component Updated

`WS topic_component_updated`

### Delete Topic Component

`DELETE /channels/{id}/topic (manage_channels)`

### Topic Component Deleted

`WS topic_component_deleted`
