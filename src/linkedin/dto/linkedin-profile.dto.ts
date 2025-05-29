import { IsString } from 'class-validator';

export class LinkedInProfileDto {
  @IsString()
  profileUrl: string;
} 