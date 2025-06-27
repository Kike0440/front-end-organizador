import type { Local, User, Contract } from '../types/Local';
import type { Expense } from '../types/index';

//const generateId = () => Math.random().toString(36).substring(2, 11);

export const initialMockLocals: Local[] = [
    {
    id: 'l1',
    name: 'Oficina Central Luminosa',
    address: 'Av. Siempre Viva 742, Springfield',
    price: 1200,
    status: 'rented',
    description: 'Amplia oficina con excelente iluminación natural, ideal para startups o equipos pequeños.',
    imageUrl: 'https://areazero20.com/wp-content/uploads/2022/04/diseno-de-locales-comerciales-1024x683.jpg',
    sizeSqMeters: 80,
  },
  {
    id: 'l2',
    name: 'Local Comercial Céntrico',
    address: 'Calle Falsa 123, Ciudad de México',
    price: 2500,
    status: 'rented',
    description: 'Ubicación privilegiada en zona de alto tráfico peatonal, perfecto para tiendas o restaurantes.',
    imageUrl: 'https://static.wixstatic.com/media/01e157_55b4db03fe3e49a2b40972e97ebc07fd~mv2.webp/v1/fill/w_1808,h_839,al_c,q_90,enc_avif,quality_auto/01e157_55b4db03fe3e49a2b40972e97ebc07fd~mv2.webp',
    sizeSqMeters: 150,
  },
  {
    id: 'l3',
    name: 'Almacén Industrial Grande',
    address: 'Vía Láctea 10, Zona Industrial',
    price: 3800,
    status: 'maintenance',
    description: 'Espacioso almacén con acceso para camiones pesados, ideal para logística y almacenamiento.',
    imageUrl: 'https://hermestan.com/wp-content/uploads/2021/05/Industrial-01.jpg',
    sizeSqMeters: 500,
  },
  {
    id: 'l4',
    name: 'Consultorio Médico Moderno',
    address: 'Paseo de la Reforma 200, CDMX',
    price: 1800,
    status: 'rented',
    description: 'Consultorio nuevo con sala de espera, ideal para profesionales de la salud.',
    imageUrl: 'https://i.pinimg.com/originals/de/a2/b0/dea2b0fa1767e0999811b0cef72f8227.jpg',
    sizeSqMeters: 60,
  },
  {
    id: 'l5',
    name: 'Nave industrial',
    address: 'Paseo de la Reforma 200, CDMX',
    price: 230000,
    status: 'rented',
    description: 'Nave industrial amplia y bien ubicada, ideal para almacenamiento y logística.',
    imageUrl: 'https://casetasdemexico.com.mx/wp-content/uploads/2018/12/como-aprovechar-una-nave-industrial-y-que-usos-tienen.jpg',
    sizeSqMeters: 500,
  },
  {
    id: 'l6',
    name: 'Local comercial en esquina con gran visibilidad',
    address: 'Calle Principal 456, Ciudad de México',
    price: 23000,
    status: 'available',
    description: 'Local comercial en esquina con gran visibilidad, ideal para tiendas o restaurantes.',
    imageUrl: 'https://renovaliainmobiliaria.com/wp-content/uploads/2020/12/aumenta-la-oferta-de-locales-comerciales-en-primera-linea.jpg',
    sizeSqMeters: 35,
  }
]

export const initialMockUsers: User[] = [
  {
    id: 'u1',
    name: 'Admin Global',
    email: 'admin@example.com',
    role: 'admin',
    password: 'admin123',
  },
  {
    id: 'u2',
    name: 'Empleado Juan Perez',
    email: 'juan.perez@example.com',
    role: 'employee',
    password: 'empleado2'
  },
  {
    id: 'u3',
    name: 'Empleado Maria Gomez',
    email: 'maria.gomez@example.com',
    role: 'employee',
    password: 'empleado3'
  },
];

export const initialMockContracts: Contract[] = [
  {
    id: 'c1',
    localId: 'l2',
    userId: 'u2',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    rentAmount: 15000,
    paymentFrequency: 'monthly',
  },
  {
    id: 'c2',
    localId: 'l4',
    userId: 'u3',
    startDate: '2025-03-15',
    endDate: '2026-03-14',
    rentAmount: 10000,
    paymentFrequency: 'monthly',
  },
  {
    id: 'c3',
    localId: 'l1',
    userId: 'u3',
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    rentAmount: 22000,
    paymentFrequency: 'monthly',
  },
  {
    id: 'c4',
    localId: 'l5',
    userId: 'u2',
    startDate: '2024-06-25',
    endDate: '2025-06-25',
    rentAmount: 220000,
    paymentFrequency: 'yearly',
  },
];

export const initialMockExpenses: Expense[] = [
  {
    id: 'e1',
    description: 'Reparación de fontanería en Local Comercial Central',
    amount: 500,
    date: '2025-06-10',
    category: 'maintenance',
    localId: 'l1',
  },
  {
    id: 'e2',
    description: 'Factura de electricidad - Oficina Moderna',
    amount: 120,
    date: '2025-06-15',
    category: 'utility',
    localId: 'l2',
  },
  {
    id: 'e3',
    description: 'Sueldo Empleado Juan Perez (Junio)',
    amount: 1500,
    date: '2025-06-20',
    category: 'salary',
    localId: undefined,
  },
  {
    id: 'e4',
    description: 'Materiales de oficina para administración',
    amount: 80,
    date: '2025-06-05',
    category: 'administrative',
    localId: undefined,
  },
  {
    id: 'e5',
    description: 'Publicidad en redes sociales (Junio)',
    amount: 300,
    date: '2025-06-12',
    category: 'marketing',
    localId: undefined,
  },
  {
    id: 'e6',
    description: 'Limpieza general de áreas comunes',
    amount: 200,
    date: '2025-05-28',
    category: 'maintenance',
    localId: undefined,
  },
  {
    id: 'e7',
    description: 'Pago de Internet para todas las oficinas',
    amount: 90,
    date: '2025-06-01',
    category: 'utility',
    localId: undefined,
  },
];
