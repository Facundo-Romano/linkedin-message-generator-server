import { Injectable } from "@nestjs/common";
import { LinkedinService } from "src/linkedin/linkedin.service";
import { OpenaiService } from "src/openia/openai.service";
import { IceBreakerResponseDto } from "./dto/ice-breaker-reponse.dto";
import { mapLinkedInToRecipientInfo } from "src/utils";
import { IceBreakerRequestDto } from "./dto/ice-breaker-request.dto";


@Injectable()
export class IceBreakerService {
  constructor(
    private readonly linkedinService: LinkedinService,
    private readonly openaiService: OpenaiService,
) {}

  async generateIcebreakers(request: IceBreakerRequestDto): Promise<IceBreakerResponseDto> {
    const recipientProfileData = await this.linkedinService.getProfileData(
        { profileUrl: request.recipientProfileUrl },
    );

    const senderProfileData = await this.linkedinService.getProfileData(
        { profileUrl: request.senderProfileUrl },
    );

    const senderInfo = {
        name: senderProfileData.firstName,
        problemSolved: request.problemSolved,
        solutionOffered: request.solutionOffered,
        //Se podría obtener el writing style del perfil del emisor generando un prompt
        // para openia para que genere un writing style basado en el perfil del emisor
        writingStyle: 'Profesional pero cercano, que muestre genuino interés y aporte valor',
    };

    const recipientInfo = mapLinkedInToRecipientInfo(recipientProfileData, recipientProfileData.posts);

    const icebreakers = await this.openaiService.generateIceBreakers(
        recipientInfo,
        senderInfo,
    );

    return {
        success: true,
        data: {
          icebreakers,
        },
    };
  }
}
