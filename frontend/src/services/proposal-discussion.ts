import { ProposalDiscussionThread, ProposalDiscussionComment } from '@/types/proposal-detail';

const STORAGE_KEY = 'proposal_discussions';

export class ProposalDiscussionService {
  private getStorage(): Record<string, ProposalDiscussionThread> {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  private saveStorage(data: Record<string, ProposalDiscussionThread>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  getDiscussionThread(proposalId: string): ProposalDiscussionThread {
    const storage = this.getStorage();
    return (
      storage[proposalId] || {
        proposalId,
        comments: [],
        totalComments: 0,
      }
    );
  }

  addComment(
    proposalId: string,
    authorAddress: string,
    content: string,
    authorName?: string
  ): ProposalDiscussionComment {
    const storage = this.getStorage();
    const thread = storage[proposalId] || {
      proposalId,
      comments: [],
      totalComments: 0,
    };

    const comment: ProposalDiscussionComment = {
      id: `comment_${Date.now()}_${Math.random()}`,
      authorAddress,
      authorName,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      isEdited: false,
      isDeleted: false,
    };

    thread.comments.push(comment);
    thread.totalComments += 1;
    thread.lastCommentAt = comment.createdAt;

    storage[proposalId] = thread;
    this.saveStorage(storage);

    return comment;
  }

  addReply(
    proposalId: string,
    parentCommentId: string,
    authorAddress: string,
    content: string,
    authorName?: string
  ): ProposalDiscussionComment | null {
    const storage = this.getStorage();
    const thread = storage[proposalId];

    if (!thread) return null;

    const reply: ProposalDiscussionComment = {
      id: `reply_${Date.now()}_${Math.random()}`,
      authorAddress,
      authorName,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      isEdited: false,
      isDeleted: false,
    };

    const findAndReply = (comments: ProposalDiscussionComment[]): boolean => {
      for (const comment of comments) {
        if (comment.id === parentCommentId) {
          comment.replies.push(reply);
          return true;
        }
        if (findAndReply(comment.replies)) {
          return true;
        }
      }
      return false;
    };

    if (findAndReply(thread.comments)) {
      thread.totalComments += 1;
      storage[proposalId] = thread;
      this.saveStorage(storage);
      return reply;
    }

    return null;
  }

  editComment(proposalId: string, commentId: string, newContent: string): boolean {
    const storage = this.getStorage();
    const thread = storage[proposalId];

    if (!thread) return false;

    const findAndEdit = (comments: ProposalDiscussionComment[]): boolean => {
      for (const comment of comments) {
        if (comment.id === commentId) {
          comment.content = newContent;
          comment.updatedAt = new Date().toISOString();
          comment.isEdited = true;
          return true;
        }
        if (findAndEdit(comment.replies)) {
          return true;
        }
      }
      return false;
    };

    if (findAndEdit(thread.comments)) {
      storage[proposalId] = thread;
      this.saveStorage(storage);
      return true;
    }

    return false;
  }

  deleteComment(proposalId: string, commentId: string): boolean {
    const storage = this.getStorage();
    const thread = storage[proposalId];

    if (!thread) return false;

    const findAndDelete = (comments: ProposalDiscussionComment[]): boolean => {
      for (const comment of comments) {
        if (comment.id === commentId) {
          comment.isDeleted = true;
          comment.content = '[deleted]';
          return true;
        }
        if (findAndDelete(comment.replies)) {
          return true;
        }
      }
      return false;
    };

    if (findAndDelete(thread.comments)) {
      storage[proposalId] = thread;
      this.saveStorage(storage);
      return true;
    }

    return false;
  }

  likeComment(proposalId: string, commentId: string): boolean {
    const storage = this.getStorage();
    const thread = storage[proposalId];

    if (!thread) return false;

    const findAndLike = (comments: ProposalDiscussionComment[]): boolean => {
      for (const comment of comments) {
        if (comment.id === commentId) {
          comment.likes += 1;
          return true;
        }
        if (findAndLike(comment.replies)) {
          return true;
        }
      }
      return false;
    };

    if (findAndLike(thread.comments)) {
      storage[proposalId] = thread;
      this.saveStorage(storage);
      return true;
    }

    return false;
  }

  clearDiscussion(proposalId: string): void {
    const storage = this.getStorage();
    delete storage[proposalId];
    this.saveStorage(storage);
  }
}

export const proposalDiscussionService = new ProposalDiscussionService();
