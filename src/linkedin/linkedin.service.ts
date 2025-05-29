import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { LinkedInResponse } from './dto/linkedin-response.dto';
import { LinkedInProfileDto } from './dto/linkedin-profile.dto';
import { extractUsernameFromUrl } from 'src/utils';

@Injectable()
export class LinkedinService {
  private readonly rapidApiKey: string;
  private readonly rapidApiHost: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RAPIDAPI_KEY');
    const apiHost = this.configService.get<string>('RAPIDAPI_HOST');

    if (!apiKey || !apiHost) {
      throw new Error('RAPIDAPI_KEY and RAPIDAPI_HOST must be defined in environment variables');
    }

    this.rapidApiKey = apiKey;
    this.rapidApiHost = apiHost;
    this.baseUrl = `${this.rapidApiHost}`;
  }

  async getProfileData(profileDto: LinkedInProfileDto): Promise<LinkedInResponse> {
    try {
      const username = extractUsernameFromUrl(profileDto.profileUrl);
      
      const response = await axios.get(
        `${this.baseUrl}/profile-data-connection-count-posts?username=${username}`,
        {
          headers: {
            'x-rapidapi-key': this.rapidApiKey,
          },
        },
      );

      return response.data;
    } catch (error) {      
      if (axios.isAxiosError(error)) {
        throw new BadRequestException(`LinkedIn API Error: ${error.message}`);
      }
      throw new BadRequestException('An unexpected error occurred while fetching LinkedIn profile data');
    }
  }
}
