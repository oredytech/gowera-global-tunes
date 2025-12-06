import { supabase } from '@/integrations/supabase/client';

export interface RadioSuggestion {
  id?: string;
  name: string;
  stream_url: string;
  website?: string;
  logo_url?: string;
  description?: string;
  contact_email?: string;
  contact_name?: string;
  country?: string;
  tags?: string[];
  language?: string;
  sponsored?: boolean;
  status?: string;
  slug?: string;
  votes?: number;
  created_at?: string;
  submitted_by?: string;
}

export interface ApprovedRadio {
  id: string;
  name: string;
  stream_url: string;
  website?: string;
  logo_url?: string;
  description?: string;
  country: string;
  tags: string[];
  language: string;
  votes: number;
  created_at: string;
  slug?: string;
}

// Fonction pour enregistrer une suggestion de radio
export async function saveRadioSuggestion(suggestion: {
  radioName: string;
  streamUrl: string;
  websiteUrl?: string;
  logoUrl?: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  senderEmail: string;
  country: string;
  tags: string;
  language: string;
}): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Vous devez être connecté pour soumettre une radio');
  }
  
  // Convert tags string to array
  const tagsArray = suggestion.tags.split(',').map(tag => tag.trim()).filter(Boolean);
  
  // Generate slug from radio name
  const slug = suggestion.radioName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const { data, error } = await supabase
    .from('radio_suggestions')
    .insert({
      name: suggestion.radioName,
      stream_url: suggestion.streamUrl,
      website: suggestion.websiteUrl || null,
      logo_url: suggestion.logoUrl || null,
      description: suggestion.description,
      contact_email: suggestion.contactEmail,
      contact_name: suggestion.senderEmail,
      country: suggestion.country,
      tags: tagsArray,
      language: suggestion.language,
      sponsored: false,
      status: 'pending',
      slug: slug,
      votes: 0,
      submitted_by: user.id
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error saving radio suggestion:', error);
    throw error;
  }

  // Envoyer la notification par email
  try {
    await supabase.functions.invoke('notify-radio-submission', {
      body: {
        radioName: suggestion.radioName,
        description: suggestion.description,
        streamUrl: suggestion.streamUrl,
        country: suggestion.country,
        language: suggestion.language,
        contactEmail: suggestion.contactEmail
      }
    });
    console.log('Notification email sent');
  } catch (emailError) {
    console.error('Failed to send notification email:', emailError);
    // On ne lance pas d'erreur ici car la radio a été enregistrée avec succès
  }

  console.log('Radio suggestion saved with ID:', data.id);
  return data.id;
}

// Fonction pour récupérer les suggestions de radio en attente
export async function getPendingRadioSuggestions(): Promise<RadioSuggestion[]> {
  const { data, error } = await supabase
    .from('radio_suggestions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting pending radio suggestions:', error);
    throw error;
  }

  return data || [];
}

// Fonction pour approuver une suggestion de radio
export async function approveRadioSuggestion(suggestionId: string): Promise<void> {
  const { error } = await supabase
    .from('radio_suggestions')
    .update({ status: 'approved', sponsored: true })
    .eq('id', suggestionId);

  if (error) {
    console.error('Error approving radio suggestion:', error);
    throw error;
  }

  console.log(`Radio suggestion ${suggestionId} has been approved`);
}

// Fonction pour rejeter une suggestion de radio
export async function rejectRadioSuggestion(suggestionId: string): Promise<void> {
  const { error } = await supabase
    .from('radio_suggestions')
    .update({ status: 'rejected' })
    .eq('id', suggestionId);

  if (error) {
    console.error('Error rejecting radio suggestion:', error);
    throw error;
  }

  console.log(`Radio suggestion ${suggestionId} has been rejected`);
}

// Fonction pour obtenir les radios approuvées les plus récentes
export async function getNewlyApprovedRadios(limitCount: number = 6): Promise<ApprovedRadio[]> {
  console.log(`Fetching newly approved radios, limit: ${limitCount}`);

  const { data, error } = await supabase
    .from('radio_suggestions')
    .select('*')
    .eq('status', 'approved')
    .order('votes', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limitCount);

  if (error) {
    console.error('Error getting newly approved radios:', error);
    throw error;
  }

  const radios: ApprovedRadio[] = (data || []).map(radio => ({
    id: radio.id,
    name: radio.name,
    stream_url: radio.stream_url,
    website: radio.website || undefined,
    logo_url: radio.logo_url || undefined,
    description: radio.description || undefined,
    country: radio.country || '',
    tags: radio.tags || [],
    language: radio.language || '',
    votes: radio.votes || 0,
    created_at: radio.created_at || '',
    slug: radio.slug || undefined
  }));

  console.log(`Found ${radios.length} newly approved radios`);
  return radios;
}

// Fonction pour récupérer une radio approuvée par son slug
export async function getApprovedRadioBySlug(slug: string): Promise<ApprovedRadio | null> {
  console.log(`Looking for radio with slug: ${slug}`);

  const { data, error } = await supabase
    .from('radio_suggestions')
    .select('*')
    .eq('status', 'approved')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error(`Error getting radio by slug ${slug}:`, error);
    throw error;
  }

  if (!data) {
    console.log(`No radio found with slug ${slug}`);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    stream_url: data.stream_url,
    website: data.website || undefined,
    logo_url: data.logo_url || undefined,
    description: data.description || undefined,
    country: data.country || '',
    tags: data.tags || [],
    language: data.language || '',
    votes: data.votes || 0,
    created_at: data.created_at || '',
    slug: data.slug || undefined
  };
}

// Fonction pour récupérer les radios par catégorie
export async function getApprovedRadiosByCategory(
  categoryType: string,
  categoryValue: string
): Promise<ApprovedRadio[]> {
  console.log(`Fetching approved radios by ${categoryType}: ${categoryValue}`);

  let query = supabase
    .from('radio_suggestions')
    .select('*')
    .eq('status', 'approved');

  switch (categoryType.toLowerCase()) {
    case 'country':
      query = query.ilike('country', `%${categoryValue}%`);
      break;
    case 'language':
      query = query.ilike('language', `%${categoryValue}%`);
      break;
    case 'tag':
      query = query.contains('tags', [categoryValue]);
      break;
    case 'search':
      query = query.ilike('name', `%${categoryValue}%`);
      break;
  }

  const { data, error } = await query
    .order('votes', { ascending: false })
    .limit(100);

  if (error) {
    console.error(`Error getting radios by ${categoryType}:`, error);
    throw error;
  }

  const radios: ApprovedRadio[] = (data || []).map(radio => ({
    id: radio.id,
    name: radio.name,
    stream_url: radio.stream_url,
    website: radio.website || undefined,
    logo_url: radio.logo_url || undefined,
    description: radio.description || undefined,
    country: radio.country || '',
    tags: radio.tags || [],
    language: radio.language || '',
    votes: radio.votes || 0,
    created_at: radio.created_at || '',
    slug: radio.slug || undefined
  }));

  console.log(`Found ${radios.length} radios matching ${categoryType}: ${categoryValue}`);
  return radios;
}

// Fonction pour voter pour une radio
export async function voteForRadio(radioId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to vote');
  }

  const { error } = await supabase
    .from('radio_votes')
    .insert({
      radio_id: radioId,
      user_id: user.id
    });

  if (error) {
    if (error.code === '23505') {
      throw new Error('You have already voted for this radio');
    }
    console.error('Error voting for radio:', error);
    throw error;
  }
}

// Fonction pour retirer un vote
export async function removeVoteForRadio(radioId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to remove vote');
  }

  const { error } = await supabase
    .from('radio_votes')
    .delete()
    .eq('radio_id', radioId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error removing vote:', error);
    throw error;
  }
}

// Fonction pour vérifier si l'utilisateur a voté
export async function hasUserVoted(radioId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data, error } = await supabase
    .from('radio_votes')
    .select('id')
    .eq('radio_id', radioId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error checking vote:', error);
    return false;
  }

  return !!data;
}
