import type { MediaId } from './media';
import { confirmed, draft, missing, type Fact, type StoreId, type TeamMemberId } from './types';

export type TeamMember = {
  id: TeamMemberId;
  name: Fact<string>;
  /**
   * Role key into the locale files (team.roles.*). Mario: owner (confirmed).
   * James: no title until confirmed — the site then shows only his name.
   */
  role: Fact<'owner' | 'tailor' | 'storeManager' | 'consultant'>;
  /** Store the person mainly works at, or null if both / unknown. */
  store: Fact<StoreId | 'both'>;
  /** Introduction text (locale files). Only Mario has one, written as draft until he approves it. */
  bio: Fact<true>;
  portrait: MediaId;
};

export const team: TeamMember[] = [
  {
    id: 'mario',
    name: confirmed('Mario'),
    role: confirmed('owner'),
    store: confirmed('both', 'Leads both stores'),
    bio: draft(true, 'Introduction text not yet approved by Mario'),
    portrait: 'portrait-mario',
  },
  {
    id: 'james',
    name: confirmed('James'),
    role: missing('Title and responsibilities not confirmed') as TeamMember['role'],
    store: missing('Location not confirmed') as TeamMember['store'],
    bio: missing('No biography — none will be invented') as Fact<true>,
    portrait: 'portrait-james',
  },
  // Further team members are added only once their details and photo approval are available.
];
