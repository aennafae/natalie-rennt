import { Injectable } from '@angular/core';
import { Run } from '../models/models';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class RunService {
  private dbPath = '/runs';

  runs: AngularFireList<Run>;

  constructor(private db: AngularFireDatabase) {
    this.runs = this.db.list(this.dbPath);
  }

  addRun(run: Run): any {
    return this.runs.push(run);
  }

  getRuns(): AngularFireList<Run> {
    return this.runs;
  }

  deleteAllRuns(): Promise<void> {
    return this.runs.remove();
  }

  updateRun(key: string, value: any): Promise<void> {
    return this.runs.update(key, value);
  }

  deleteRun(key: string): Promise<void> {
    return this.runs.remove(key);
  }
}
