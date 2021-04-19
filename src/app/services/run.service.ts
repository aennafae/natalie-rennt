import { Injectable } from '@angular/core';
import { Run } from '../models/models';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class RunService {
  private dbPath = '/runs';

  runs: AngularFireList<Run>;
  currentIndex: number = 18;

  constructor(private db: AngularFireDatabase) {
    this.runs = this.db.list(this.dbPath, ref => ref.orderByChild('timestamp').limitToLast(this.currentIndex));
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

  /**
   * 
   */
  loadMoreRuns() {
    this.currentIndex += 10;
    return this.db.list(this.dbPath, ref => ref.orderByChild('timestamp').limitToLast(this.currentIndex));
  }
}
