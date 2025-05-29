import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class IceBreakerRequestDto {
  @IsNotEmpty()
  @IsUrl({}, { message: 'URL de perfil de emisor inválida.' })
  senderProfileUrl: string;

  @IsNotEmpty()
  @IsString()
  problemSolved: string;

  @IsNotEmpty()
  @IsString()
  solutionOffered: string;

  @IsNotEmpty()
  @IsUrl({}, { message: 'URL de perfil de destinatario inválida.' })
  recipientProfileUrl: string;
}