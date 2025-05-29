import { BadRequestException } from "@nestjs/common";
import { LinkedInPost, LinkedInResponse } from "src/linkedin/dto/linkedin-response.dto";
import { RecipientInfo, SenderInfo } from "src/types";

export function mapLinkedInToRecipientInfo(profile: LinkedInResponse, posts: LinkedInPost[]) {
  const recentPosition = profile.position?.[0];
  const recentEducation = profile.educations?.[0];
  const recentPosts = posts?.slice(0, 2).map(post => ({
    text: post.text,
    topic: post.article?.title || post.text?.substring(0, 100),
    url: post.postUrl,
  })) || [];
  const skills = profile.skills?.map(skill => skill.name) || [];
  const linkedinStatus = [
    profile.isTopVoice ? 'Top Voice' : null,
    profile.isCreator ? 'Creator' : null,
  ].filter(Boolean).join(', ') || undefined;

  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    headline: profile.headline,
    recentRoleTitle: recentPosition?.title,
    recentRoleCompany: recentPosition?.companyName,
    quantifiableAchievement: profile.summary || '',
    careerImpact: recentPosition?.description || '',
    recentPosts,
    skills,
    linkedinStatus,
    education: recentEducation ? `${recentEducation.degree || ''} ${recentEducation.schoolName}`.trim() : undefined,
  };
}

export const extractUsernameFromUrl =(profileUrl: string): string => {
  try {
    const url = new URL(profileUrl);
    
    if (!url.hostname.includes('linkedin.com')) {
      throw new BadRequestException('URL must be from LinkedIn domain');
    }

    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2 || pathParts[0] !== 'in') {
      throw new BadRequestException('Invalid LinkedIn profile URL format. Expected format: https://linkedin.com/in/username');
    }

    const username = pathParts[1];
    if (!username) {
      throw new BadRequestException('Username not found in LinkedIn URL');
    }

    return username;
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new BadRequestException('Invalid LinkedIn profile URL');
  }
}

export const buildPrompt = (
  senderInfo: SenderInfo,
  recipientInfo: RecipientInfo,
): string => {  
  const formatRecentPosts = (posts?: { text?: string; topic?: string; url?: string }[]): string => {
    if (!posts || posts.length === 0) return '';
    
    return posts.map((post, index) => `
  * **Post Reciente #${index + 1} - Extracto:** "${post.text || ''}"
  * **Post Reciente #${index + 1} - Tema/Artículo:** "${post.topic || ''}"${post.url ? ` (URL: ${post.url})` : ''}`).join('\n');
  }

  return `Por favor, genera 3 opciones de mensajes icebreaker para LinkedIn basados en la siguiente información:

### Información del EMISOR:
* Problema que resuelve: "${senderInfo.problemSolved}"
* Solución que ofrece: "${senderInfo.solutionOffered}"
* Estilo de escritura deseado por el emisor: "${senderInfo.writingStyle || 'Profesional pero cercano, que muestre genuino interés y aporte valor.'}"

### Puntos Clave sobre el DESTINATARIO (${recipientInfo.firstName} ${recipientInfo.lastName}):

* **Nombre Completo:** ${recipientInfo.firstName} ${recipientInfo.lastName}
* **Titular LinkedIn:** "${recipientInfo.headline || ''}"
* **Rol Principal (Más Reciente):** "${recipientInfo.recentRoleTitle || ''}" en "${recipientInfo.recentRoleCompany || ''}"
* **Logro Destacado Principal:** "${recipientInfo.quantifiableAchievement || ''}"
* **Otro Logro/Resumen Carrera:** "${recipientInfo.careerImpact || ''}"
${formatRecentPosts(recipientInfo.recentPosts)}
* **Habilidades Principales:** ${recipientInfo.skills?.join(', ') || ''}
* **Reconocimientos/Estatus LinkedIn:** ${recipientInfo.linkedinStatus || ''}
* **Educación Destacada:** "${recipientInfo.education || ''}"`;
}

export const parseIcebreakers = (content: string): string[] =>{
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
      return parsed;
    }
  } catch (error) {
    const messages = content
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);

    if (messages.length >= 3) {
      return messages.slice(0, 3);
    }
  }

  throw new Error('Could not parse icebreaker messages from OpenAI response');
}