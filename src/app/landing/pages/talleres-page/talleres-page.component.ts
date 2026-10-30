import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

type TallerId = 'vespertino' | 'avanzado' | 'pintar-piezas' | 'cumpleanos';

interface TallerDetail {
  readonly label: string;
  readonly value: string;
}

interface TallerOption {
  readonly id: TallerId;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly schedule: readonly string[];
  readonly details: readonly TallerDetail[];
  readonly included: readonly string[];
  readonly note?: string;
  readonly whatsappMessage: string;
}

@Component({
  selector: 'app-talleres-page',
  templateUrl: './talleres-page.component.html',
  styleUrls: ['./talleres-page.component.css'],
  standalone: false
})
export class TalleresPageComponent {
  readonly heroImageUrl = `${environment.CDN_URL}/images/torno3.png?d=1920x1080`;

  readonly talleres: readonly TallerOption[] = [
    {
      id: 'vespertino',
      eyebrow: 'Curso de construcción manual',
      title: 'Curso vespertino',
      description: 'Construye tus piezas desde cero y decóralas en una clase semanal de dos horas.',
      schedule: ['Martes, miércoles o viernes', '6:00 a 8:00 p. m.'],
      details: [
        { label: 'Sesión individual', value: '$280' },
        { label: '4 clases · 1 día por semana', value: '$1,000' },
        { label: '8 clases · 2 días por semana', value: '$2,000' },
        { label: '12 clases · 3 días por semana', value: '$3,000' }
      ],
      included: ['Todos los materiales', 'Quemas de tus piezas'],
      note: 'Curso para mayores de 15 años.',
      whatsappMessage: '¡Hola! Quisiera solicitar más información sobre el Curso Vespertino de construcción manual. ¿Me podrían compartir la disponibilidad y las indicaciones para reservar?'
    },
    {
      id: 'avanzado',
      eyebrow: 'Curso de construcción manual',
      title: 'Curso avanzado de alta temperatura',
      description: 'Continúa desarrollando tu técnica con materiales y quemas de alta temperatura.',
      schedule: ['Martes, miércoles o viernes', '6:00 a 8:00 p. m.'],
      details: [
        { label: 'Sesión individual', value: '$350' },
        { label: '4 clases · 1 día por semana', value: '$1,300' }
      ],
      included: ['Todos los materiales', 'Quemas de tus piezas'],
      note: 'Curso para mayores de 15 años.',
      whatsappMessage: '¡Hola! Quisiera solicitar más información sobre el Curso Avanzado de Alta Temperatura. ¿Me podrían compartir la disponibilidad, los requisitos y las indicaciones para reservar?'
    },
    {
      id: 'pintar-piezas',
      eyebrow: 'Experiencia de 2 horas',
      title: 'Pintar piezas',
      description: 'Elige una pieza de cerámica y personalízala durante una clase guiada.',
      schedule: ['Martes, miércoles o viernes', '6:00 a 8:00 p. m.'],
      details: [
        { label: 'Taza vertical', value: '$400' },
        { label: 'Plato de 15 cm', value: '$500' },
        { label: 'Bowl', value: '$500' },
        { label: 'Vaso V60', value: '$500' },
        { label: 'Set matcha: bowl, boquilla y portachasen', value: '$700' },
        { label: 'Florero vertical de 15 cm', value: '$800' }
      ],
      included: ['La pieza elegida', 'Materiales para decorarla', 'Quemas de la pieza'],
      whatsappMessage: '¡Hola! Quisiera solicitar más información sobre la clase para Pintar Piezas. ¿Me podrían compartir la disponibilidad de piezas y las indicaciones para reservar?'
    },
    {
      id: 'cumpleanos',
      eyebrow: 'Experiencia para grupos',
      title: 'Paquete de cumpleaños',
      description: 'Celebra con una clase privada de dos horas para decorar una taza.',
      schedule: ['Lunes o jueves · 12:00 a 5:00 p. m.', 'Sábados · 4:00 a 6:00 p. m.', 'Domingos · 12:00 a 4:00 p. m.'],
      details: [
        { label: 'Precio por persona', value: '$550' },
        { label: 'Cupo', value: '8 a 18 personas' }
      ],
      included: ['Una taza por persona', 'Materiales y quemas', 'Vino y snacks', 'Pastel con sabor a elegir al reservar con 15 días de anticipación'],
      whatsappMessage: '¡Hola! Quisiera solicitar más información sobre el Paquete de Cumpleaños. ¿Me podrían compartir las fechas disponibles y las indicaciones para reservar?'
    }
  ];

  openWhatsApp(taller: TallerOption): void {
    const encodedMessage = encodeURIComponent(taller.whatsappMessage);
    const url = `https://wa.me/${environment.WHATSAPP_SOURCE_MOBILE}?text=${encodedMessage}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
