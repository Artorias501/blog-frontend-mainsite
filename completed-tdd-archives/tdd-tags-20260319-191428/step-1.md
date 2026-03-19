# Step 1 - Understand Intent

## Functional Requirements

### FR-1: Tag Type Definition

Export Tag interface with id, name, and created_at fields. The interface should follow snake_case naming convention to match backend API.

### FR-2: getTags Function

Implement getTags function that fetches paginated list of tags. The function should accept optional pagination parameters (limit, offset) and return PaginatedResponse<Tag>.

### FR-3: getTagById Function

Implement getTagById function that fetches a single tag by its ID. The function should accept number or string ID and return the tag data.

### FR-4: searchTags Function

Implement searchTags function that searches tags by keyword. The function should accept keyword parameter and optional pagination parameters, returning PaginatedResponse<Tag>.

## Assumptions

- Backend API endpoints follow RESTful convention: `/tags`, `/tags/:id`, `/tags/search`
- Pagination parameters match posts service: limit and offset
- Response format matches posts service: uses PaginatedResponse<T>
- Tag timestamps use ISO 8601 format (same as Post)
- The Tag interface in posts.ts is a minimal version; the full Tag in tags.ts will include created_at
