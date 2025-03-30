import axios from 'axios';

interface Message {
  role: string;
  content: string;
}

interface AIRequestContext {
  portfolio?: {
    holdings: number;
    totalValue: number;
    metrics: any;
  };
  previousMessages?: Message[];
}

export async function getAIResponse(message: string, context?: AIRequestContext): Promise<string> {
  try {
    // Set up system message with instructions about the app
    const systemMessage = `You are an AI financial advisor in the Swipefolio app, a fun and engaging investment learning platform.
    
Swipefolio helps users learn about investing through:
- Stock card swiping for learning
- Real-time portfolio construction
- Gamified competition with other users
- Detailed metrics on Performance, Stability, Value, and Momentum
- Personalized AI recommendations

Use these guidelines when answering:
1. Be concise and conversational - Gen Z audience values quick, straight-to-the-point responses
2. Always explain investment concepts in simple terms without jargon
3. For beginners, focus on education and fundamentals 
4. Be enthusiastic and supportive, but never overpromise returns
5. Include specific actionable advice when appropriate
6. If portfolio data is available, reference it directly

Remember, you're helping someone learn investing in a fun, casual way. Keep responses under 150 words when possible.`;

    // Construct messages array
    const messages: Message[] = [
      { role: 'system', content: systemMessage }
    ];

    // Add context about the user's portfolio if available
    if (context && context.portfolio) {
      const portfolioContext = `
Current portfolio context:
- Holdings: ${context.portfolio.holdings || 'None'} 
- Total portfolio value: ${context.portfolio.totalValue ? `$${context.portfolio.totalValue.toFixed(2)}` : '$0.00'}
${context.portfolio.metrics ? `- Quality score: ${context.portfolio.metrics.qualityScore}
- Performance: ${context.portfolio.metrics.performance}
- Stability: ${context.portfolio.metrics.stability}
- Value: ${context.portfolio.metrics.value}
- Momentum: ${context.portfolio.metrics.momentum}` : ''}
`;
      messages.push({ role: 'system', content: portfolioContext });
    }

    // Add previous messages for context if available
    if (context && context.previousMessages && context.previousMessages.length > 0) {
      // Only include the last few messages to avoid token limits
      const recentMessages = context.previousMessages.slice(-4);
      messages.push(...recentMessages);
    }

    // Add the current user message
    messages.push({ role: 'user', content: message });

    // Make the API request to OpenRouter
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://swipefolio.replit.app',
          'X-Title': 'Swipefolio',
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract the assistant's response
    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message
    ) {
      return response.data.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
}