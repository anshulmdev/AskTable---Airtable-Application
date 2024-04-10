// controllers/claudeApi.js
import { env } from '../env';
import { globalConfig } from '@airtable/blocks';
import { reduceUserCredit } from './userController';

export async function askClaude(question) {
  try {
    const user = globalConfig.get('airtableuserid');
    if (!user || user.credits <= 0) {
      throw new Error('Insufficient credits');
    }
    const url = env.CLAUDE_SERVER;
    const data = { "prompt": question, "apiKey": env.CLAUDE_API };
    const request = await fetch(url, { method: "POST", body: JSON.stringify(data) });

    if (request.ok) {
      const response = await request.json();
      await reduceUserCredit(); // Call the function to reduce user credit
      return response;
    } else {
      const errorData = await request.text();
      throw new Error(`Error from Claude API: ${errorData}`);
    }
  } catch (error) {
    console.error('Error in askClaude:', error);
    throw error;
  }
}