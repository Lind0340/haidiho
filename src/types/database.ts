export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'member' | 'moderator' | 'admin'
export type RoomId = 'water_cooler' | 'training_room' | 'help_desk'
export type ModerationStatus = 'pending' | 'approved' | 'rejected'
export type StripStatus = 'draft' | 'published'
export type StoryStatus = 'pending' | 'approved' | 'turned_into_strip' | 'rejected'
export type NewsletterStatus = 'active' | 'unsubscribed'
export type ProductStatus = 'draft' | 'active' | 'sold_out' | 'discontinued'

export type Profile = {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  role: UserRole
  mug_submitted: boolean
  story_submitted: boolean
  joined_at: string
  updated_at: string
}

export type CommunityPost = {
  id: string
  user_id: string | null
  guest_author?: string | null
  story_submission_id?: string | null
  room: RoomId
  content: string
  status: ModerationStatus
  is_featured: boolean
  featured_week: string | null
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
}

export type PostLike = {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export type PostComment = {
  id: string
  post_id: string
  user_id: string
  content: string
  status: ModerationStatus
  like_count: number
  created_at: string
  updated_at: string
}

export type Strip = {
  id: string
  strip_number: number | null
  title: string
  slug: string | null
  image_url: string
  caption: string | null
  category: string | null
  inspired_by_post_id: string | null
  inspired_by_member: string | null
  status: StripStatus
  published_at: string | null
  created_at: string
}

export type StripLike = {
  id: string
  strip_id: string
  user_id: string
  created_at: string
}

export type MugSubmission = {
  id: string
  user_id: string | null
  member_name: string
  member_title: string | null
  mug_text: string | null
  mug_story: string | null
  image_url: string
  status: ModerationStatus
  is_featured: boolean
  featured_week: string | null
  appeared_in_strip_id: string | null
  created_at: string
}

export type StorySubmission = {
  id: string
  user_id: string | null
  submitter_name: string
  submitter_email: string | null
  room: RoomId | null
  story_content: string
  ai_tool_used: string | null
  status: StoryStatus
  turned_into_strip_id: string | null
  moderator_notes: string | null
  created_at: string
}

export type NewsletterSubscriber = {
  id: string
  email: string
  first_name: string | null
  status: NewsletterStatus
  source: string | null
  subscribed_at: string
  unsubscribed_at: string | null
}

export type ModerationQueueItem = {
  id: string
  content_type: 'post' | 'comment' | 'mug' | 'story'
  content_id: string
  status: ModerationStatus
  moderator_id: string | null
  moderator_notes: string | null
  reviewed_at: string | null
  created_at: string
}

export type SiteSetting = {
  id: string
  key: string
  value: Json
  description: string | null
  updated_by: string | null
  updated_at: string
}

export type FeaturedContent = {
  id: string
  week_of: string
  featured_strip_id: string | null
  featured_mug_id: string | null
  featured_post_id: string | null
  featured_story_id: string | null
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string }; Update: Partial<Profile> }
      community_posts: {
        Row: CommunityPost
        Insert: {
          user_id: string
          room: RoomId
          content: string
          status?: ModerationStatus
        }
        Update: Partial<CommunityPost>
      }
      post_likes: { Row: PostLike; Insert: { post_id: string; user_id: string }; Update: Partial<PostLike> }
      post_comments: {
        Row: PostComment
        Insert: { post_id: string; user_id: string; content: string }
        Update: Partial<PostComment>
      }
      strips: { Row: Strip; Insert: Partial<Strip> & { title: string; image_url: string }; Update: Partial<Strip> }
      strip_likes: { Row: StripLike; Insert: { strip_id: string; user_id: string }; Update: Partial<StripLike> }
      mug_submissions: {
        Row: MugSubmission
        Insert: {
          user_id?: string | null
          member_name: string
          member_title?: string | null
          mug_text?: string | null
          mug_story?: string | null
          image_url: string
          status?: ModerationStatus
        }
        Update: Partial<MugSubmission>
        Relationships: []
      }
      story_submissions: {
        Row: StorySubmission
        Insert: {
          user_id?: string | null
          submitter_name: string
          submitter_email?: string | null
          room?: RoomId | null
          story_content: string
          ai_tool_used?: string | null
          status?: StoryStatus
        }
        Update: Partial<StorySubmission>
      }
      newsletter_subscribers: {
        Row: NewsletterSubscriber
        Insert: {
          email: string
          first_name?: string | null
          source?: string | null
          status?: NewsletterStatus
        }
        Update: Partial<NewsletterSubscriber>
      }
      moderation_queue: { Row: ModerationQueueItem; Insert: Partial<ModerationQueueItem>; Update: Partial<ModerationQueueItem> }
      site_settings: { Row: SiteSetting; Insert: Partial<SiteSetting>; Update: Partial<SiteSetting> }
      featured_content: { Row: FeaturedContent; Insert: Partial<FeaturedContent>; Update: Partial<FeaturedContent> }
      newsletter_issues: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      products: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type PostWithProfile = CommunityPost & {
  profiles: Pick<Profile, 'username' | 'display_name' | 'avatar_url'> | null
}

export type RoomLatestPreview = {
  username: string
  content: string
  createdAt: string
}

export type RoomStats = {
  room: RoomId
  post_count: number
  latest_post: string | null
  latest_preview: RoomLatestPreview | null
}
