export interface GroupMember {
  id: string;
  name: string;
  role: 'ADMIN' | 'MEMBER';
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  topic: string;
  membersCount: number;
  members?: GroupMember[];
  isJoined?: boolean;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}
