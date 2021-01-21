import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Run } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class RunService {
  constructor(private http: HttpClient) {}

  addRun(run: Run): Observable<Run> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Run>('http://localhost:3000/runs', run, {
      headers: headers,
    });
  }

  getRuns(): Observable<Run[]> {
    return this.http.get<Run[]>('http://localhost:3000/runs');
  }
}
