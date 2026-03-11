/* ── Comment types ─────────────────────────────── */

/**
 * Sort order for comment lists.
 */
export type CommentSortOrder = 'newest' | 'oldest';

/**
 * Reaction type that users can apply to a comment.
 */
export type ReactionType = 'upvote' | 'downvote';

/**
 * A single reaction record tied to a comment.
 */
export interface CommentReaction {
  /** The address that reacted */
  address: string;
  /** The type of reaction */
  type: ReactionType;
  /** Timestamp when the reaction was created */
  createdAt: number;
}

/**
 * A single comment on a proposal.
 */
export interface Comment {
  /** Unique identifier for the comment */
  id: string;
  /** The proposal this comment belongs to */
  proposalId: number;
  /** Stacks address of the comment author */
  author: string;
  /** The comment text content */
  content: string;
  /** Unix timestamp when the comment was created */
  createdAt: number;
  /** Unix timestamp when the comment was last edited, or null */
  editedAt: number | null;
  /** ID of the parent comment for threaded replies, or null for top-level */
  parentId: string | null;
  /** Whether the comment has been soft-deleted */
  deleted: boolean;
  /** Reactions on this comment */
  reactions: CommentReaction[];
}

/**
 * Data required to create a new comment.
 */
export interface NewCommentInput {
  proposalId: number;
  author: string;
  content: string;
  parentId?: string | null;
}

/**
 * Data required to edit an existing comment.
 */
export interface EditCommentInput {
  commentId: string;
  content: string;
  author: string;
}

/**
 * Comment validation rules and limits.
 */
export interface CommentRules {
  /** Minimum content length (characters) */
  minLength: number;
  /** Maximum content length (characters) */
  maxLength: number;
  /** Maximum nesting depth for threaded replies */
  maxReplyDepth: number;
  /** Maximum number of comments per proposal per user */
  maxCommentsPerUser: number;
}

/**
 * Default comment validation rules.
 */
export const COMMENT_RULES: CommentRules = {
  minLength: 2,
  maxLength: 1000,
  maxReplyDepth: 3,
  maxCommentsPerUser: 50,
};

/**
 * Comment validation error structure.
 */
export interface CommentValidationError {
  field: string;
  message: string;
}

/**
 * Props for the CommentForm component.
 */
export interface CommentFormProps {
  proposalId: number;
  parentId?: string | null;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

/**
 * Props for the CommentItem component.
 */
export interface CommentItemProps {
  comment: Comment;
  proposalId: number;
  depth?: number;
}

/**
 * Props for the CommentList component.
 */
export interface CommentListProps {
  proposalId: number;
}

/**
 * Props for the CommentSortToggle component.
 */
export interface CommentSortToggleProps {
  value: CommentSortOrder;
  onChange: (order: CommentSortOrder) => void;
}

/**
 * Props for the CommentSection (top-level integration component).
 */
export interface CommentSectionProps {
  proposalId: number;
}
