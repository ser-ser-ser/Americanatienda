export async function getContextualOrder(supabase: any, conversationId: string) {

    // 1. Get Conversation Metadata
    const { data: conv } = await supabase
        .from('conversations')
        .select('store_id, created_by')
        .eq('id', conversationId)
        .single();

    if (!conv) return null;

    // 2. Fetch Participants
    const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId);

    const participantIds = participants?.map((p: any) => p.user_id) || [];

    // 3. Find most recent order from any participant who is not the vendor
    // (We look for orders where store_id matches if available)
    let query = supabase
        .from('orders')
        .select('*')
        .in('user_id', participantIds);

    if (conv.store_id) {
        query = query.eq('store_id', conv.store_id);
    }

    const { data: orders } = await query
        .order('created_at', { ascending: false })
        .limit(1);

    return orders?.[0] || null;
}
