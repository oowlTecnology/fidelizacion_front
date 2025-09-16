import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Affiliate, AffiliateFilters, AffiliateSearchResult, AffiliateStats } from '../models/affiliate.model';

@Injectable({
  providedIn: 'root'
})
export class AffiliatesService {
  private affiliatesSubject = new BehaviorSubject<Affiliate[]>([]);
  public affiliates$ = this.affiliatesSubject.asObservable();

  // Datos mock para desarrollo
  private mockAffiliates: Affiliate[] = [
    {
      id: '1',
      personalInfo: {
        firstName: 'María',
        lastName: 'González',
        middleName: 'Carmen',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'female',
        nationality: 'Colombiana',
        identificationType: 'cedula',
        identificationNumber: '12345678',
        occupation: 'Abogada',
        education: 'university',
        maritalStatus: 'married',
        children: 2
      },
      contactInfo: {
        primaryPhone: '3001234567',
        secondaryPhone: '6012345678',
        email: 'maria.gonzalez@email.com',
        address: {
          street: 'Carrera 15',
          number: '45-67',
          neighborhood: 'Chapinero',
          city: 'Bogotá',
          state: 'Cundinamarca',
          postalCode: '110221',
          country: 'Colombia'
        },
        emergencyContact: {
          name: 'Carlos González',
          relationship: 'Esposo',
          phone: '3007654321'
        }
      },
      politicalInfo: {
        politicalExperience: [
          {
            position: 'Concejal',
            organization: 'Concejo Municipal',
            startDate: new Date('2019-01-01'),
            endDate: new Date('2023-12-31'),
            description: 'Representante del partido en el concejo municipal'
          }
        ],
        interests: ['Educación', 'Salud pública', 'Medio ambiente'],
        skills: ['Liderazgo', 'Comunicación', 'Negociación'],
        availability: {
          timeSlots: ['Mañanas', 'Tardes'],
          daysAvailable: ['Lunes', 'Miércoles', 'Viernes'],
          volunteerAreas: ['Organización de eventos', 'Campañas'],
          canTravel: true,
          maxDistance: 50
        },
        motivation: 'Contribuir al desarrollo social y político de mi comunidad'
      },
      verificationStatus: {
        isVerified: true,
        verifiedAt: new Date('2024-01-15'),
        verifiedBy: 'admin001',
        documentsVerified: true,
        backgroundCheck: true,
        interviewCompleted: true,
        referencesChecked: true,
        notes: 'Afiliado verificado exitosamente'
      },
      membershipInfo: {
        membershipNumber: 'AFF-2024-001',
        joinDate: new Date('2024-01-10'),
        membershipType: 'active',
        duesStatus: 'current',
        lastPaymentDate: new Date('2024-01-10'),
        nextPaymentDate: new Date('2025-01-10'),
        benefits: ['Acceso a eventos', 'Material de campaña', 'Capacitaciones']
      },
      documents: [
        {
          id: 'doc1',
          type: { name: 'Cédula', required: true, description: 'Documento de identidad' },
          name: 'cedula_maria_gonzalez.pdf',
          url: '/documents/cedula_maria_gonzalez.pdf',
          uploadedAt: new Date('2024-01-10'),
          verified: true,
          verifiedBy: 'admin001',
          verifiedAt: new Date('2024-01-15')
        }
      ],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      personalInfo: {
        firstName: 'Juan',
        lastName: 'Pérez',
        dateOfBirth: new Date('1990-07-22'),
        gender: 'male',
        nationality: 'Colombiana',
        identificationType: 'cedula',
        identificationNumber: '87654321',
        occupation: 'Ingeniero',
        education: 'university',
        maritalStatus: 'single'
      },
      contactInfo: {
        primaryPhone: '3109876543',
        email: 'juan.perez@email.com',
        address: {
          street: 'Calle 80',
          number: '12-34',
          neighborhood: 'Teusaquillo',
          city: 'Bogotá',
          state: 'Cundinamarca',
          postalCode: '110231',
          country: 'Colombia'
        }
      },
      politicalInfo: {
        politicalExperience: [],
        interests: ['Tecnología', 'Innovación', 'Empleo juvenil'],
        skills: ['Programación', 'Análisis de datos', 'Proyectos'],
        availability: {
          timeSlots: ['Noches', 'Fines de semana'],
          daysAvailable: ['Sábado', 'Domingo'],
          volunteerAreas: ['Desarrollo web', 'Análisis de datos'],
          canTravel: false
        },
        motivation: 'Aplicar mis conocimientos técnicos para mejorar la gestión pública'
      },
      verificationStatus: {
        isVerified: false,
        documentsVerified: true,
        backgroundCheck: false,
        interviewCompleted: false,
        referencesChecked: false,
        notes: 'Pendiente entrevista y verificación de referencias'
      },
      membershipInfo: {
        membershipNumber: 'AFF-2024-002',
        joinDate: new Date('2024-02-01'),
        membershipType: 'basic',
        duesStatus: 'current',
        lastPaymentDate: new Date('2024-02-01'),
        nextPaymentDate: new Date('2025-02-01'),
        benefits: ['Acceso básico', 'Newsletter']
      },
      documents: [
        {
          id: 'doc2',
          type: { name: 'Cédula', required: true, description: 'Documento de identidad' },
          name: 'cedula_juan_perez.pdf',
          url: '/documents/cedula_juan_perez.pdf',
          uploadedAt: new Date('2024-02-01'),
          verified: true,
          verifiedBy: 'admin001',
          verifiedAt: new Date('2024-02-01')
        }
      ],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    }
  ];

  constructor() {
    this.affiliatesSubject.next(this.mockAffiliates);
  }

  getAffiliates(filters?: AffiliateFilters, page: number = 1, limit: number = 10): Observable<AffiliateSearchResult> {
    return this.affiliates$.pipe(
      map(affiliates => {
        let filteredAffiliates = [...affiliates];

        // Aplicar filtros
        if (filters) {
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredAffiliates = filteredAffiliates.filter(affiliate =>
              affiliate.personalInfo.firstName.toLowerCase().includes(searchTerm) ||
              affiliate.personalInfo.lastName.toLowerCase().includes(searchTerm) ||
              affiliate.personalInfo.identificationNumber.includes(searchTerm) ||
              affiliate.contactInfo.email.toLowerCase().includes(searchTerm)
            );
          }

          if (filters.status) {
            switch (filters.status) {
              case 'verified':
                filteredAffiliates = filteredAffiliates.filter(a => a.verificationStatus.isVerified);
                break;
              case 'pending':
                filteredAffiliates = filteredAffiliates.filter(a => !a.verificationStatus.isVerified);
                break;
              case 'rejected':
                // Implementar lógica de rechazo si es necesario
                break;
            }
          }

          if (filters.membershipType) {
            filteredAffiliates = filteredAffiliates.filter(a => 
              a.membershipInfo.membershipType === filters.membershipType
            );
          }

          if (filters.city) {
            filteredAffiliates = filteredAffiliates.filter(a => 
              a.contactInfo.address.city.toLowerCase().includes(filters.city!.toLowerCase())
            );
          }
        }

        // Paginación
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedAffiliates = filteredAffiliates.slice(startIndex, endIndex);

        return {
          affiliates: paginatedAffiliates,
          total: filteredAffiliates.length,
          page,
          limit,
          hasMore: endIndex < filteredAffiliates.length
        };
      }),
      delay(300) // Simular delay de red
    );
  }

  getAffiliateById(id: string): Observable<Affiliate | null> {
    return this.affiliates$.pipe(
      map(affiliates => affiliates.find(a => a.id === id) || null)
    );
  }

  createAffiliate(affiliate: Omit<Affiliate, 'id' | 'createdAt' | 'updatedAt'>): Observable<Affiliate> {
    return new Observable(observer => {
      const newAffiliate: Affiliate = {
        ...affiliate,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const currentAffiliates = this.affiliatesSubject.value;
      this.affiliatesSubject.next([...currentAffiliates, newAffiliate]);

      setTimeout(() => {
        observer.next(newAffiliate);
        observer.complete();
      }, 500);
    });
  }

  updateAffiliate(id: string, updates: Partial<Affiliate>): Observable<Affiliate | null> {
    return new Observable(observer => {
      const currentAffiliates = this.affiliatesSubject.value;
      const index = currentAffiliates.findIndex(a => a.id === id);

      if (index === -1) {
        observer.next(null);
        observer.complete();
        return;
      }

      const updatedAffiliate = {
        ...currentAffiliates[index],
        ...updates,
        updatedAt: new Date()
      };

      currentAffiliates[index] = updatedAffiliate;
      this.affiliatesSubject.next([...currentAffiliates]);

      setTimeout(() => {
        observer.next(updatedAffiliate);
        observer.complete();
      }, 300);
    });
  }

  deleteAffiliate(id: string): Observable<boolean> {
    return new Observable(observer => {
      const currentAffiliates = this.affiliatesSubject.value;
      const filteredAffiliates = currentAffiliates.filter(a => a.id !== id);
      
      if (filteredAffiliates.length === currentAffiliates.length) {
        observer.next(false);
        observer.complete();
        return;
      }

      this.affiliatesSubject.next(filteredAffiliates);

      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 300);
    });
  }

  verifyAffiliate(id: string, verifiedBy: string, notes?: string): Observable<boolean> {
    return this.updateAffiliate(id, {
      verificationStatus: {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy,
        documentsVerified: true,
        backgroundCheck: true,
        interviewCompleted: true,
        referencesChecked: true,
        notes
      }
    }).pipe(
      map(affiliate => !!affiliate)
    );
  }

  getAffiliateStats(): Observable<AffiliateStats> {
    return this.affiliates$.pipe(
      map(affiliates => {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const newThisMonth = affiliates.filter(a => a.createdAt >= thisMonth).length;
        const newThisWeek = affiliates.filter(a => a.createdAt >= thisWeek).length;
        const verified = affiliates.filter(a => a.verificationStatus.isVerified).length;
        const pending = affiliates.filter(a => !a.verificationStatus.isVerified).length;

        // Estadísticas por tipo de membresía
        const byMembershipType = affiliates.reduce((acc, affiliate) => {
          acc[affiliate.membershipInfo.membershipType] = (acc[affiliate.membershipInfo.membershipType] || 0) + 1;
          return acc;
        }, {} as any);

        // Estadísticas por educación
        const byEducation = affiliates.reduce((acc, affiliate) => {
          acc[affiliate.personalInfo.education] = (acc[affiliate.personalInfo.education] || 0) + 1;
          return acc;
        }, {} as any);

        // Estadísticas por ciudad
        const byCity = affiliates.reduce((acc, affiliate) => {
          const city = affiliate.contactInfo.address.city;
          acc[city] = (acc[city] || 0) + 1;
          return acc;
        }, {} as any);

        // Edad promedio
        const totalAge = affiliates.reduce((sum, affiliate) => {
          const age = now.getFullYear() - affiliate.personalInfo.dateOfBirth.getFullYear();
          return sum + age;
        }, 0);
        const averageAge = affiliates.length > 0 ? Math.round(totalAge / affiliates.length) : 0;

        return {
          total: affiliates.length,
          verified,
          pending,
          rejected: 0,
          newThisMonth,
          newThisWeek,
          byMembershipType,
          byEducation,
          byCity,
          averageAge
        };
      })
    );
  }

  private generateId(): string {
    return 'AFF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}
