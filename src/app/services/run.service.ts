import { Injectable } from '@angular/core';
import { Run } from '../models/models';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class RunService {
  private dbPath = '/runs';

  runs: AngularFireList<Run>;
  runsToLoadLimit: number = 10;

  constructor(private db: AngularFireDatabase) {
    this.runs = this.db.list(this.dbPath);
  }

  addRun(run: Run): any {
    return this.runs.push(run);
  }

  /**
   * Returns the last 10 runs
   */
  getFirstRuns(): AngularFireList<Run> {
    return this.db.list(this.dbPath, ref => ref.orderByChild('timestamp').limitToLast(this.runsToLoadLimit));
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
   * Query to load more runs starting form a specific position and limited to a specific amount of runs.
   */
  loadMoreRuns(lastItemTime: number): AngularFireList<Run> {
    return this.db.list(this.dbPath, ref => ref.orderByChild('timestamp').startAfter(lastItemTime).limitToLast(this.runsToLoadLimit));
  }

  getAllRuns(): AngularFireList<Run> {
    return this.runs;
  }
}
