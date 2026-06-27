-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'LOCKED', 'DISABLED');

-- CreateEnum
CREATE TYPE "RoleCode" AS ENUM ('GUEST', 'STUDENT', 'LECTURER', 'CONTENT_MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'HIDDEN', 'DELETED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StudyGroupVisibility" AS ENUM ('PUBLIC', 'REQUEST_TO_JOIN', 'PRIVATE');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REMOVED');

-- CreateEnum
CREATE TYPE "ForumPostStatus" AS ENUM ('PUBLISHED', 'LOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('DOCUMENT_UPLOAD', 'DOCUMENT_APPROVE', 'DOCUMENT_REJECT', 'REPORT_HANDLE', 'ACCOUNT_LOCK', 'ACCOUNT_UNLOCK', 'ROLE_ASSIGN', 'CONTENT_DELETE', 'SYSTEM_CONFIG_UPDATE', 'DOCUMENT_DOWNLOAD', 'DOCUMENT_REPORT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "refresh_token_hash" TEXT,
    "full_name" TEXT NOT NULL,
    "student_code" TEXT,
    "lecturer_code" TEXT,
    "avatar_url" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "code" "RoleCode" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "assigned_by_id" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "category_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "rejection_reason" TEXT,
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_files" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "storage_provider" TEXT NOT NULL,
    "bucket" TEXT,
    "object_key" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "checksum" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_favorites" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_reviews" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_ratings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_reports" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "handled_by_id" TEXT,
    "resolution_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_posts" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "ForumPostStatus" NOT NULL DEFAULT 'PUBLISHED',
    "locked_by_id" TEXT,
    "locked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "forum_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_comments" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "content" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "forum_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_reports" (
    "id" TEXT NOT NULL,
    "post_id" TEXT,
    "comment_id" TEXT,
    "reporter_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "handled_by_id" TEXT,
    "resolution_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forum_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_groups" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "StudyGroupVisibility" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_group_members" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING',
    "joined_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_group_documents" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "shared_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_group_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_group_posts" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "study_group_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_group_comments" (
    "id" TEXT NOT NULL,
    "group_post_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "study_group_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_moderation_logs" (
    "id" TEXT NOT NULL,
    "moderator_id" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_moderation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_configs" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT,
    "action" "AuditAction" NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_follows" (
    "id" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_notes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_student_code_key" ON "users"("student_code");

-- CreateIndex
CREATE UNIQUE INDEX "users_lecturer_code_key" ON "users"("lecturer_code");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_categories_name_key" ON "document_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "document_categories_slug_key" ON "document_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "document_favorites_user_id_document_id_key" ON "document_favorites"("user_id", "document_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_ratings_user_id_document_id_key" ON "document_ratings"("user_id", "document_id");

-- CreateIndex
CREATE UNIQUE INDEX "study_group_members_group_id_user_id_key" ON "study_group_members"("group_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "study_group_documents_group_id_document_id_key" ON "study_group_documents"("group_id", "document_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_configs_key_key" ON "system_configs"("key");

-- CreateIndex
CREATE UNIQUE INDEX "user_follows_follower_id_following_id_key" ON "user_follows"("follower_id", "following_id");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "document_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_files" ADD CONSTRAINT "document_files_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_favorites" ADD CONSTRAINT "document_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_favorites" ADD CONSTRAINT "document_favorites_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_reviews" ADD CONSTRAINT "document_reviews_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_reviews" ADD CONSTRAINT "document_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_ratings" ADD CONSTRAINT "document_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_ratings" ADD CONSTRAINT "document_ratings_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_reports" ADD CONSTRAINT "document_reports_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_reports" ADD CONSTRAINT "document_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_reports" ADD CONSTRAINT "document_reports_handled_by_id_fkey" FOREIGN KEY ("handled_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_locked_by_id_fkey" FOREIGN KEY ("locked_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_comments" ADD CONSTRAINT "forum_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "forum_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_comments" ADD CONSTRAINT "forum_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_comments" ADD CONSTRAINT "forum_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "forum_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_reports" ADD CONSTRAINT "forum_reports_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "forum_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_reports" ADD CONSTRAINT "forum_reports_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "forum_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_reports" ADD CONSTRAINT "forum_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_reports" ADD CONSTRAINT "forum_reports_handled_by_id_fkey" FOREIGN KEY ("handled_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_groups" ADD CONSTRAINT "study_groups_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_members" ADD CONSTRAINT "study_group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "study_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_members" ADD CONSTRAINT "study_group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_documents" ADD CONSTRAINT "study_group_documents_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "study_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_documents" ADD CONSTRAINT "study_group_documents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_documents" ADD CONSTRAINT "study_group_documents_shared_by_id_fkey" FOREIGN KEY ("shared_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_posts" ADD CONSTRAINT "study_group_posts_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "study_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_posts" ADD CONSTRAINT "study_group_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_comments" ADD CONSTRAINT "study_group_comments_group_post_id_fkey" FOREIGN KEY ("group_post_id") REFERENCES "study_group_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_comments" ADD CONSTRAINT "study_group_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_moderation_logs" ADD CONSTRAINT "content_moderation_logs_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_configs" ADD CONSTRAINT "system_configs_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_notes" ADD CONSTRAINT "document_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_notes" ADD CONSTRAINT "document_notes_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_history" ADD CONSTRAINT "document_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_history" ADD CONSTRAINT "document_history_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
