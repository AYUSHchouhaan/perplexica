

export async function simpleWebSearch(query: string): Promise<string> {
  console.log('🔍 [SimpleWebSearch] Starting web search...');
  console.log('🔍 [SimpleWebSearch] Query:', query);
  
  try {
    if (!process.env.EXA_API_KEY) {
      console.error('❌ [SimpleWebSearch] EXA_API_KEY not found in environment variables');
      return "Web search failed: API key not configured.";
    }
    
    console.log('✅ [SimpleWebSearch] API key found, making request to Exa...');
    
    const response = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.EXA_API_KEY,
      },
      body: JSON.stringify({
        query,
        numResults: 5,
        type: "keyword", // Use keyword for broader, more current results
        contents: {
          text: true, // Get page text content
          summary: true, // Get AI-generated summary
        },
        useAutoprompt: true, // Better query understanding
        startPublishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
      }),
    });

    console.log('📡 [SimpleWebSearch] Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [SimpleWebSearch] API request failed:', errorText);
      return `Web search failed: ${response.status} ${response.statusText}`;
    }

    const data = await response.json();
    console.log('📦 [SimpleWebSearch] Response data received:', {
      hasResults: !!data?.results,
      resultCount: data?.results?.length || 0
    });

    if (!data?.results || data.results.length === 0) {
      console.warn('⚠️ [SimpleWebSearch] No results found');
      return "No web results found.";
    }

    // Log recency info for debugging
    // const now = new Date();
    // const recentResults = data.results.filter((r: any) => {
    //   if (!r.publishedDate) return false;
    //   const publishedDate = new Date(r.publishedDate);
    //   const hoursDiff = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60);
    //   return hoursDiff <= 24;
    // });
    // console.log(`📅 [SimpleWebSearch] Found ${recentResults.length} results from last 24 hours out of ${data.results.length} total`);

    // Build readable text summary
    console.log('📝 [SimpleWebSearch] Building summary from results...');
    const summary = data.results
      .map((r: { title?: string; url?: string; publishedDate?: string; summary?: string; text?: string; snippet?: string }, i: number) => {
        console.log(`  Result #${i + 1}: ${r.title} - ${r.url}`);
        console.log(`    Published: ${r.publishedDate || 'No date'}`);
        
        // Get the content - prioritize summary, then text, then fallback
        const content = r.summary || r.text || r.snippet || 'No content available';
        
        // Limit content length per result to avoid token overflow
        const truncatedContent = content.length > 1000 
          ? content.substring(0, 1000) + '...' 
          : content;
        
        return `Source #${i + 1}: ${r.title}
Published: ${r.publishedDate || 'Unknown date'}
URL: ${r.url}
Content: ${truncatedContent}`;
      })
      .join("\n\n");

    console.log('✅ [SimpleWebSearch] Summary created successfully');
    console.log('📊 [SimpleWebSearch] Summary length:', summary.length, 'characters');
    
    return summary;
  } catch (err) {
    console.error('❌ [SimpleWebSearch] Search failed with error:', err);
    console.error('❌ [SimpleWebSearch] Error details:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
    });
    return "Web search failed.";
  }
}
