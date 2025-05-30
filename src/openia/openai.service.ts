import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecipientInfo, SenderInfo } from 'src/types';
import { buildPrompt } from 'src/utils';

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

      const prompt = buildPrompt(senderInfo, recipientInfo);
      
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `Eres un experto en crear mensajes personalizados para conexiones de LinkedIn. 
              Tu tarea es generar 3 mensajes rompehielos basados en la información del perfil del destinatario y la información del perfil del remitente.
              Cada mensaje debe ser:
              - Personalizado y específico al contexto del destinatario
              - Profesional pero conversacional
              - Menos de 300 caracteres
              - Incluir una llamada a la acción clara
              - Referenciar detalles específicos tanto del perfil del destinatario como del remitente
              
              Formatea tu respuesta como un objeto JSON con esta estructura:
              {
                "iceBreakers": [
                  {
                    "message": "El texto del primer mensaje"
                  },
                  {
                    "message": "El texto del segundo mensaje"
                  },
                  {
                    "message": "El texto del tercer mensaje"
                  }
                ]
              }
                
              Aquí hay algunos ejemplos de remitente, destinatario y mensajes rompehielos:
              Prompt:
                Remitente:
                  <data>Problema que resuelve: Muchas empresas B2B invierten en publicidad online pero no logran convertir ese tráfico en reuniones de venta calificadas.</data>
                  <data>Solución que ofrece: Implementamos embudos de conversión optimizados con landing pages de alta efectividad y secuencias de email marketing personalizadas que nutren a los prospectos hasta agendar una demo.</data>
                  <data>Estilo de escritura del emisor: Profesional pero cercano, que muestre genuino interés y aporte valor.</data>
                Destinatario:
                  <data>Nombre Completo: Juan Perez</data>
                  <data>Titular LinkedIn: Juan Pe</data>
                  <data>Rol Principal (Más Reciente): CEO en SquadS</data>
                  <data>Logro Destacado Principal: Crear una empresa de software de 1000000 de dólares en un plazo de 5 años</data>
                  <data>Otro Logro/Resumen Carrera: Liderar equipos de 10 personas en proyectos de desarrollo de software</data>
                  <data>Post Reciente #1 - Extracto: Me encanta trabajar desde casa.</data>
                  <data>Post Reciente #1 - Tema/Artículo: Home Office</data>
                  <data>Habilidades Principales: Gestión de proyectos, Gestión de equipos, Gestión de presupuestos</data>
              Respuesta:
                Icebreakers: [
                  {
                    "message": "Hola, noté tu impresionante trayectoria en SquadS. Como alguien que ayuda a las empresas B2B a optimizar la conversión de su publicidad online, me intrigan tus ideas sobre las posibilidades de los clientes. ¿Podríamos agendar una llamada para discutirlo?"
                  },
                  {
                    "message": "Hola, leí tu publicación sobre Home Office y tus logros son admirables. Me enfoco en optimizar la conversión de anuncios online para empresas B2B, y me encantaría escuchar sobre tu experiencia. ¿Te gustaría tener una conversación?"
                  },
                  {
                    "message": "¡Saludos! Tu publicación sobre el futuro de SquadS llamó mi atención. Trabajo en la optimización de embudos de conversión para empresas B2B, y me interesa tu perspectiva. ¿Podríamos tener una discusión al respecto?"
                  }
                ]
              
              Prompt:
                Remitente:
                  <data>Problema que resuelve: Los ciclos de desarrollo son lentos y los despliegues a producción generan errores frecuentes, retrasando la entrega de valor a los usuarios.</data>
                  <data>Solución que ofrece: Ayudamos a equipos de desarrollo a adoptar prácticas de CI/CD (Integración Continua/Despliegue Continuo) y automatización de pruebas, reduciendo el tiempo de entrega y mejorando la estabilidad del software.</data>
                  <data>Estilo de escritura del emisor: Técnico pero claro, enfocado en la eficiencia y la calidad.</data>
                Destinatario:
                  <data>Nombre Completo: Sofia Alonso</data>
                  <data>Titular LinkedIn: CTO at Innovatech Startups | Building High-Performance Engineering Teams</data>
                  <data>Rol Principal (Más Reciente): Chief Technology Officer en Innovatech Startups</data>
                  <data>Logro Destacado Principal: Redujo el tiempo de ciclo de desarrollo en un 40% implementando nuevas herramientas DevOps.</data>
                  <data>Otro Logro/Resumen Carrera: Escaló la infraestructura tecnológica para soportar un crecimiento de usuarios del 300% en un año.</data>
                  <data>Post Reciente #1 - Extracto: "La clave para la innovación rápida no es solo tener buenas ideas, sino también la capacidad de implementarlas y probarlas de forma ágil y segura. #DevOps #Agile"</data>
                  <data>Post Reciente #1 - Tema/Artículo: Agilidad y Seguridad en la Implementación de Software.</data>
                  <data>Habilidades Principales: Liderazgo Técnico, Arquitectura de Software, DevOps, Metodologías Ágiles, Cloud Computing (AWS/Azure).</data>
              Respuesta:
                Icebreakers: [
                  {
                  "message": "Hola Sofia, vi tu publicación sobre implementación ágil y segura de software. Me especializo en ayudar a equipos a optimizar sus ciclos de desarrollo con CI/CD y automatización de pruebas, lo cual parece alinearse con tus ideas. ¿Podríamos discutir cómo manejan esto en Innovatech?"
                  },
                  {
                  "message": "Hola Sofia, ¡felicitaciones por la reducción del 40% en el tiempo del ciclo de desarrollo en Innovatech! Es un logro significativo. Nos especializamos en prácticas de CI/CD que ayudan a estabilizar despliegues y acelerar entregas. ¿Te interesa una breve charla?"
                  },
                  {
                  "message": "Saludos Sofia, como CTO construyendo equipos de alto rendimiento, imagino que optimizar los flujos de desarrollo es siempre una prioridad. Ayudamos a equipos de ingeniería a reducir errores de despliegue y acelerar entregas. ¿Te interesaría compartir experiencias o explorar mejores prácticas?"
                  }
                ]
                
              Prompt:
                Remitente:
                  <data>Problema que resuelve: Las empresas tecnológicas con alto crecimiento experimentan una alta rotación de personal en sus primeros dos años, lo que impacta la moral y los costos de contratación.</data>
                  <data>Solución que ofrece: Diseñamos e implementamos programas de desarrollo profesional y cultura organizacional que aumentan el compromiso y la retención del talento clave.</data>
                  <data>Estilo de escritura del emisor: Empático, centrado en las personas y estratégico.</data>
                Destinatario:
                  <data>Nombre Completo: David Rodríguez</data>
                  <data>Titular LinkedIn: CEO at GrowthMode SaaS | Scaling Companies Through People</data>
                  <data>Rol Principal (Más Reciente): CEO en GrowthMode SaaS</data>
                  <data>Logro Destacado Principal: Llevó a GrowthMode SaaS a ser reconocida como 'Mejor Lugar para Trabajar' en el sector tech local por dos años consecutivos.</data>
                  <data>Otro Logro/Resumen Carrera: Duplicó el tamaño de la empresa en 18 meses manteniendo una tasa de rotación por debajo del promedio de la industria.</data>
                  <data>Post Reciente #1 - Extracto: "El activo más importante de cualquier empresa de tecnología es su gente. Invertir en su crecimiento y bienestar no es un gasto, es la mejor inversión. #CompanyCulture #Leadership"</data>
                  <data>Post Reciente #1 - Tema/Artículo: Importancia de la Cultura Organizacional y el Liderazgo.</data>
                  <data>Habilidades Principales: Liderazgo Ejecutivo, Desarrollo Organizacional, Cultura Empresarial, Gestión del Talento, Estrategia de Crecimiento.</data>
              Respuesta:
                Icebreakers: [
                  {
                  "message": "Hola David, tu publicación sobre que la cultura de la empresa es la mejor inversión realmente resuena. Nos especializamos en diseñar programas de desarrollo profesional que abordan la rotación de empleados en empresas tecnológicas de alto crecimiento. Dado tu éxito en GrowthMode SaaS, me encantaría escuchar tu perspectiva."
                  },
                  {
                  "message": "Hola David, ¡felicitaciones por que GrowthMode SaaS haya sido nombrada 'Mejor Lugar para Trabajar'! Es un reflejo fantástico de tu liderazgo. Mi trabajo se centra en mejorar el compromiso y la retención de empleados a través de programas personalizados. ¿Quizás podríamos intercambiar algunas ideas?"
                  },
                  {
                  "message": "Saludos David, como CEO que ha escalado exitosamente una empresa mientras mantiene una baja rotación, tus ideas son invaluables. Ayudamos a las empresas tecnológicas a construir culturas robustas y caminos de desarrollo para retener el talento clave. ¿Te gustaría tener una breve conversación sobre tu enfoque?"
                  }
                ]`,
            },
            {
              role: 'user',
              content: prompt,
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
