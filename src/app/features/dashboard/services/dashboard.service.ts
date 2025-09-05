import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  getStats(): Observable<any> {
    // Mock data para estadísticas del dashboard
    const mockStats = {
      totalUsers: 1250,
      activeUsers: 980,
      newUsers: 45,
      totalRevenue: 125000.50
    };

    // Simular delay de red
    return of(mockStats).pipe(delay(800));
  }
}
