import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecipientInfo, SenderInfo } from 'src/types';

@Injectable()
export class OpenaiService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY must be defined in environment variables');
    }
    this.apiKey = apiKey;
  }

  async generateIceBreakers(
    recipientInfo: RecipientInfo,
    senderInfo: SenderInfo,
  ): Promise<string[]> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an expert at crafting personalized LinkedIn connection messages. 
              Your task is to generate 2-3 icebreaker messages based on the recipient's profile information.
              Each message should be:
              - Personalized and specific to the recipient's background
              - Professional yet conversational
              - Under 300 characters
              - Include a clear call to action
              - Reference specific details from their profile
              
              Format your response as a JSON object with this structure:
              {
                "iceBreakers": [
                  {
                    "message": "The actual message text",
                    "context": "Brief explanation of what profile element inspired this message",
                    "tone": "The tone of the message"
                  }
                ]
              }`,
            },
            {
              role: 'user',
              content: JSON.stringify({
                recipientInfo,
                senderInfo,
              }),
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const content = JSON.parse(response.data.choices[0].message.content);

      if (content.iceBreakers) {
        return content.iceBreakers.map(icebreaker => icebreaker.message);
      }

      return content;
    } catch (error) {
      throw error;
    }
  }
}
