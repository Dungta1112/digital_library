# Data Model: Digital Library Forum Backend

## Enumerations

- **UserStatus**: `ACTIVE`, `LOCKED`, `DISABLED`
- **RoleCode**: `GUEST`, `STUDENT`, `LECTURER`, `CONTENT_MANAGER`, `ADMIN`
- **DocumentStatus**: `DRAFT`, `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `HIDDEN`, `DELETED`
- **ReportStatus**: `PENDING`, `IN_REVIEW`, `RESOLVED`, `REJECTED`
- **StudyGroupVisibility**: `PUBLIC`, `REQUEST_TO_JOIN`, `PRIVATE`
- **MembershipStatus**: `PENDING`, `APPROVED`, `REJECTED`, `REMOVED`
- **ForumPostStatus**: `PUBLISHED`, `LOCKED`, `DELETED`
- **AuditAction**: `DOCUMENT_UPLOAD`, `DOCUMENT_APPROVE`, `DOCUMENT_REJECT`, `REPORT_HANDLE`, `ACCOUNT_LOCK`, `ACCOUNT_UNLOCK`, `ROLE_ASSIGN`, `CONTENT_DELETE`, `SYSTEM_CONFIG_UPDATE`

## Entities

### users

- `id`: UUID primary key
- `email`: unique, required
- `password_hash`: required
- `full_name`: required
- `student_code`: optional, unique when present
- `lecturer_code`: optional, unique when present
- `avatar_url`: optional
- `status`: UserStatus, default `ACTIVE`
- `last_login_at`: optional timestamp
- `created_at`, `updated_at`: timestamps

Relationships:
- Many-to-many with roles through `user_roles`
- One-to-many with documents as owner/uploader
- One-to-many with forum posts/comments, study group memberships, reports, and audit logs

Validation:
- Email must be valid and unique
- Password is never returned and must be stored as bcrypt hash
- Locked users cannot log in

### roles

- `id`: UUID primary key
- `code`: RoleCode, unique
- `name`: required
- `description`: optional
- `created_at`, `updated_at`: timestamps

Relationships:
- Many-to-many with users through `user_roles`
- Many-to-many with permissions through `role_permissions`

### permissions

- `id`: UUID primary key
- `code`: unique permission code such as `documents.approve`
- `name`: required
- `description`: optional
- `created_at`, `updated_at`: timestamps

### user_roles

- `id`: UUID primary key
- `user_id`: required FK to users
- `role_id`: required FK to roles
- `assigned_by_id`: optional FK to users
- `assigned_at`: timestamp

Constraints:
- Unique (`user_id`, `role_id`)

### role_permissions

- `id`: UUID primary key
- `role_id`: required FK to roles
- `permission_id`: required FK to permissions

Constraints:
- Unique (`role_id`, `permission_id`)

### document_categories

- `id`: UUID primary key
- `name`: required, unique
- `slug`: required, unique
- `description`: optional
- `is_active`: boolean
- `created_at`, `updated_at`: timestamps

### documents

- `id`: UUID primary key
- `owner_id`: required FK to users
- `category_id`: optional FK to document_categories
- `title`: required
- `description`: optional
- `metadata`: JSON for author, subject, course, tags, academic year
- `status`: DocumentStatus
- `visibility`: public, private, or group-scoped value
- `rejection_reason`: optional
- `approved_by_id`: optional FK to users
- `approved_at`: optional timestamp
- `view_count`, `download_count`: counters
- `created_at`, `updated_at`, `deleted_at`: timestamps

Relationships:
- One-to-many with document_files, document_reviews, document_reports, ratings, favorites
- Many-to-many/group relationship through study_group_documents

State transitions:
- Lecturer upload: `DRAFT` or `PENDING_REVIEW`
- Submit for review: `DRAFT` -> `PENDING_REVIEW`
- Approve: `PENDING_REVIEW` -> `APPROVED`
- Reject: `PENDING_REVIEW` -> `REJECTED` with required reason
- Hide: `APPROVED` -> `HIDDEN`
- Delete: any owner/admin-allowed state -> `DELETED`

### document_files

- `id`: UUID primary key
- `document_id`: required FK to documents
- `storage_provider`: `MINIO` or `LOCAL`
- `bucket`: optional
- `object_key`: required
- `original_name`: required
- `mime_type`: required
- `size_bytes`: required
- `checksum`: optional
- `created_at`: timestamp

Validation:
- MIME type and extension must match system configuration
- Size must not exceed configured maximum

### document_favorites

- `id`: UUID primary key
- `user_id`: required FK to users
- `document_id`: required FK to documents
- `created_at`: timestamp

Constraints:
- Unique (`user_id`, `document_id`)

### document_reviews

- `id`: UUID primary key
- `document_id`: required FK to documents
- `reviewer_id`: required FK to users
- `status`: approved or rejected decision
- `reason`: required when rejected
- `created_at`: timestamp

### document_ratings

- `id`: UUID primary key
- `user_id`: required FK to users
- `document_id`: required FK to documents
- `rating`: integer 1-5
- `comment`: optional
- `created_at`, `updated_at`: timestamps

Constraints:
- Unique (`user_id`, `document_id`)

### document_reports

- `id`: UUID primary key
- `document_id`: required FK to documents
- `reporter_id`: required FK to users
- `reason`: required
- `description`: optional
- `status`: ReportStatus
- `handled_by_id`: optional FK to users
- `resolution_note`: optional
- `created_at`, `updated_at`: timestamps

### forum_posts

- `id`: UUID primary key
- `author_id`: required FK to users
- `title`: required
- `content`: required
- `status`: ForumPostStatus
- `locked_by_id`: optional FK to users
- `locked_at`: optional timestamp
- `created_at`, `updated_at`, `deleted_at`: timestamps

Rules:
- Authors may edit/delete their own post unless locked/deleted
- Content managers may delete violating posts and lock topics

### forum_comments

- `id`: UUID primary key
- `post_id`: required FK to forum_posts
- `author_id`: required FK to users
- `parent_id`: optional FK to forum_comments
- `content`: required
- `deleted_at`: optional timestamp
- `created_at`, `updated_at`: timestamps

### forum_reports

- `id`: UUID primary key
- `post_id`: optional FK to forum_posts
- `comment_id`: optional FK to forum_comments
- `reporter_id`: required FK to users
- `reason`: required
- `description`: optional
- `status`: ReportStatus
- `handled_by_id`: optional FK to users
- `resolution_note`: optional
- `created_at`, `updated_at`: timestamps

Constraint:
- Exactly one of `post_id` or `comment_id` must be present.

### study_groups

- `id`: UUID primary key
- `owner_id`: required FK to users
- `name`: required
- `description`: optional
- `visibility`: StudyGroupVisibility
- `is_active`: boolean
- `created_at`, `updated_at`: timestamps

Rules:
- Lecturer owners can manage members and group settings

### study_group_members

- `id`: UUID primary key
- `group_id`: required FK to study_groups
- `user_id`: required FK to users
- `role`: `OWNER`, `MEMBER`
- `status`: MembershipStatus
- `joined_at`: optional timestamp
- `created_at`, `updated_at`: timestamps

Constraints:
- Unique (`group_id`, `user_id`)

### study_group_documents

- `id`: UUID primary key
- `group_id`: required FK to study_groups
- `document_id`: required FK to documents
- `shared_by_id`: required FK to users
- `created_at`: timestamp

Constraints:
- Unique (`group_id`, `document_id`)

### study_group_posts

- `id`: UUID primary key
- `group_id`: required FK to study_groups
- `author_id`: required FK to users
- `title`: required
- `content`: required
- `created_at`, `updated_at`, `deleted_at`: timestamps

### study_group_comments

- `id`: UUID primary key
- `group_post_id`: required FK to study_group_posts
- `author_id`: required FK to users
- `content`: required
- `created_at`, `updated_at`, `deleted_at`: timestamps

### content_moderation_logs

- `id`: UUID primary key
- `moderator_id`: required FK to users
- `target_type`: document, forum_post, forum_comment, report
- `target_id`: UUID
- `action`: required
- `reason`: optional
- `created_at`: timestamp

### system_configs

- `id`: UUID primary key
- `key`: unique, required
- `value`: JSON, required
- `description`: optional
- `updated_by_id`: optional FK to users
- `created_at`, `updated_at`: timestamps

Required config keys:
- `upload.allowed_file_types`
- `upload.max_file_size_bytes`
- `document.review_required`
- `cache.enabled`

### audit_logs

- `id`: UUID primary key
- `actor_id`: optional FK to users
- `action`: AuditAction
- `target_type`: required
- `target_id`: optional UUID
- `metadata`: JSON
- `ip_address`: optional
- `user_agent`: optional
- `created_at`: timestamp

Rules:
- Required for document upload/review, report handling, account lock/unlock, role assignment, content deletion, and system config changes
- Audit logs are append-only from application behavior
