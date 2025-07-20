/**
 * TypeScript types generated from Prisma schema
 * This file contains all the type definitions for the application's data models
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Video quality presets
 */
export enum Preset {
  HD = 'HD',
  SD = 'SD',
}

/**
 * Workspace visibility types
 */
export enum WorkspaceType {
  PERSONAL = 'PERSONAL',
  PUBLIC = 'PUBLIC',
}

/**
 * Subscription plan types
 */
export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
}

// ============================================================================
// BASE INTERFACES
// ============================================================================

/**
 * Base interface for all entities with common fields
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// USER RELATED TYPES
// ============================================================================

/**
 * User entity interface
 */
export interface User extends BaseEntity {
  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  trial: boolean;
  clerk_id: string;
}

/**
 * User with optional relations
 */
export interface UserWithRelations extends User {
  studio?: Media;
  workspaces?: Workspace[];
  videos?: Video[];
  subscriptions?: Subscription[];
  members?: Member[];
  notifications?: Notification[];
  sentInvites?: Invite[];
  receivedInvites?: Invite[];
}

/**
 * User creation payload
 */
export interface CreateUserPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  trial?: boolean;
  clerk_id: string;
}

/**
 * User update payload
 */
export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  image?: string;
  trial?: boolean;
}

// ============================================================================
// SUBSCRIPTION RELATED TYPES
// ============================================================================

/**
 * Subscription entity interface
 */
export interface Subscription extends BaseEntity {
  user_id: string;
  plan: SubscriptionPlan;
  customerId?: string;
  user?: User;
}

/**
 * Subscription creation payload
 */
export interface CreateSubscriptionPayload {
  user_id: string;
  plan?: SubscriptionPlan;
  customerId?: string;
}

/**
 * Subscription update payload
 */
export interface UpdateSubscriptionPayload {
  plan?: SubscriptionPlan;
  customerId?: string;
}

// ============================================================================
// VIDEO RELATED TYPES
// ============================================================================

/**
 * Video entity interface
 */
export interface Video extends BaseEntity {
  user_id: string;
  title: string;
  description?: string;
  source?: string;
  folder_id?: string;
  processing: boolean;
  workspace_id: string;
  views: number;
  summary?: string;
  user?: User;
  folder?: Folder;
  workspace?: Workspace;
}

/**
 * Video with relations
 */
export interface VideoWithRelations extends Video {
  user: User;
  folder?: Folder;
  workspace: Workspace;
}

/**
 * Video creation payload
 */
export interface CreateVideoPayload {
  user_id: string;
  title?: string;
  description?: string;
  source?: string;
  folder_id?: string;
  workspace_id: string;
  processing?: boolean;
  summary?: string;
}

/**
 * Video update payload
 */
export interface UpdateVideoPayload {
  title?: string;
  description?: string;
  source?: string;
  folder_id?: string;
  processing?: boolean;
  summary?: string;
  views?: number;
}

// ============================================================================
// FOLDER RELATED TYPES
// ============================================================================

/**
 * Folder entity interface
 */
export interface Folder extends BaseEntity {
  name: string;
  workspace_id: string;
  videos?: Video[];
  workspace?: Workspace;
}

/**
 * Folder with relations
 */
export interface FolderWithRelations extends Folder {
  videos: Video[];
  workspace: Workspace;
}

/**
 * Folder creation payload
 */
export interface CreateFolderPayload {
  name?: string;
  workspace_id: string;
}

/**
 * Folder update payload
 */
export interface UpdateFolderPayload {
  name?: string;
}

// ============================================================================
// MEDIA RELATED TYPES
// ============================================================================

/**
 * Media entity interface
 */
export interface Media extends BaseEntity {
  screen?: string;
  mic?: string;
  camera?: string;
  preset: Preset;
  user_id: string;
  user?: User;
}

/**
 * Media creation payload
 */
export interface CreateMediaPayload {
  screen?: string;
  mic?: string;
  camera?: string;
  preset?: Preset;
  user_id: string;
}

/**
 * Media update payload
 */
export interface UpdateMediaPayload {
  screen?: string;
  mic?: string;
  camera?: string;
  preset?: Preset;
}

// ============================================================================
// MEMBER RELATED TYPES
// ============================================================================

/**
 * Member entity interface
 */
export interface Member extends BaseEntity {
  user_id: string;
  workspace_id: string;
  member: boolean;
  user?: User;
  workspace?: Workspace;
}

/**
 * Member with relations
 */
export interface MemberWithRelations extends Member {
  user: User;
  workspace: Workspace;
}

/**
 * Member creation payload
 */
export interface CreateMemberPayload {
  user_id: string;
  workspace_id: string;
  member?: boolean;
}

/**
 * Member update payload
 */
export interface UpdateMemberPayload {
  member?: boolean;
}

// ============================================================================
// NOTIFICATION RELATED TYPES
// ============================================================================

/**
 * Notification entity interface
 */
export interface Notification extends BaseEntity {
  user_id: string;
  content: string;
  user?: User;
}

/**
 * Notification creation payload
 */
export interface CreateNotificationPayload {
  user_id: string;
  content: string;
}

/**
 * Notification update payload
 */
export interface UpdateNotificationPayload {
  content?: string;
}

// ============================================================================
// WORKSPACE RELATED TYPES
// ============================================================================

/**
 * Workspace entity interface
 */
export interface Workspace extends BaseEntity {
  name: string;
  type: WorkspaceType;
  user_id: string;
  folders?: Folder[];
  videos?: Video[];
  members?: Member[];
  invites?: Invite[];
  user?: User;
}

/**
 * Workspace with relations
 */
export interface WorkspaceWithRelations extends Workspace {
  folders: Folder[];
  videos: Video[];
  members: Member[];
  invites: Invite[];
  user: User;
}

/**
 * Workspace creation payload
 */
export interface CreateWorkspacePayload {
  name: string;
  type?: WorkspaceType;
  user_id: string;
}

/**
 * Workspace update payload
 */
export interface UpdateWorkspacePayload {
  name?: string;
  type?: WorkspaceType;
}

// ============================================================================
// INVITE RELATED TYPES
// ============================================================================

/**
 * Invite entity interface
 */
export interface Invite extends BaseEntity {
  sender_id: string;
  receiver_id: string;
  workspace_id: string;
  accepted: boolean;
  content: string;
  sender?: User;
  receiver?: User;
  workspace?: Workspace;
}

/**
 * Invite with relations
 */
export interface InviteWithRelations extends Invite {
  sender: User;
  receiver: User;
  workspace: Workspace;
}

/**
 * Invite creation payload
 */
export interface CreateInvitePayload {
  sender_id: string;
  receiver_id: string;
  workspace_id: string;
  content: string;
  accepted?: boolean;
}

/**
 * Invite update payload
 */
export interface UpdateInvitePayload {
  accepted?: boolean;
  content?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Filter options for queries
 */
export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

/**
 * Database query options
 */
export interface QueryOptions extends PaginationParams, FilterOptions {
  include?: Record<string, boolean>;
  select?: Record<string, boolean>;
}

// ============================================================================
// FORM TYPES
// ============================================================================

/**
 * Form field validation
 */
export interface FormField {
  value: string;
  error?: string;
  isValid: boolean;
  isTouched: boolean;
}

/**
 * Form state
 */
export interface FormState {
  [key: string]: FormField;
}

// ============================================================================
// AUTH TYPES
// ============================================================================

/**
 * Authentication user
 */
export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  clerk_id: string;
}

/**
 * Session data
 */
export interface Session {
  user: AuthUser;
  isAuthenticated: boolean;
  expiresAt: Date;
}

/**
 * Workspace props for the getWorkspaces function return type
 */
export interface WorkspaceProps {
  subscriptions: {
    plan: SubscriptionPlan;
  } | null;
  workspaces: {
    id: string;
    name: string;
    image?: string;
  }[];
  members: {
    Workspace: {
      id: string;
      name: string;
      type: WorkspaceType;
    };
  }[];
}

// ============================================================================
// WORKSPACE ACTION RETURN TYPES
// ============================================================================

/**
 * Return type for verifyAccessToWorkspace function
 */
export interface VerifyAccessToWorkspaceResponse {
  status: 200 | 403 | 500;
  success: boolean;
  message?: string;
  data?: {
    workspace: Workspace;
  };
}

/**
 * Return type for getWorkspaceFolders function
 */
export interface GetWorkspaceFoldersResponse {
  status: 200 | 404 | 500;
  success: boolean;
  message?: string;
  data?: {
    folders: (Folder & {
      _count: {
        videos: number;
      };
    })[];
  };
}

/**
 * Return type for getUserVideos function
 */
export interface GetUserVideosResponse {
  status: 200 | 404 | 500;
  success: boolean;
  message?: string;
  data?: {
    videos: {
      id: string;
      title: string;
      createdAt: Date;
      source?: string | null;
      processing: boolean;
      Folder?: {
        id: string;
        name: string;
      } | null;
      User?: {
        firstname?: string | null;
        lastname?: string | null;
        image?: string | null;
      } | null;
    }[];
  };
}

/**
 * Return type for getWorkspaces function
 */
export interface GetWorkspacesResponse {
  status: 200 | 403 | 404 | 500;
  success: boolean;
  message?: string;
  data?: {
    workspaces: WorkspaceProps;
  };
}