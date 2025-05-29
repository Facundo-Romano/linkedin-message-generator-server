import { Controller, Post, Body } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';
import { LinkedInProfileDto } from './dto/linkedin-profile.dto';

@Controller('linkedin')
export class LinkedinController {
  constructor(private readonly linkedinService: LinkedinService) {}

  @Post('profile')
  async getProfileData(@Body() profileDto: LinkedInProfileDto) {
    return this.linkedinService.getProfileData(profileDto);
  }
} 