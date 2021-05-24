import { Injectable } from '@angular/core';
import { Run, Score } from '../models/models';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class RunService {
  private dbPath = '/runs';
  private dbPathScore = '/score';

  runs: AngularFireList<Run>;
  score: AngularFireList<Score>;
  numberOfRunsToLoadLimit: number = 12;

  constructor(private db: AngularFireDatabase) {
    this.runs = this.db.list(this.dbPath, ref => ref.orderByChild('timestamp'));
    this.score = this.db.list(this.dbPathScore, ref => ref.orderByChild('km'));
  }

  addRun(run: Run): any {
    debugger;
    return this.runs.push(run);
  }

  /**
   * Returns the last 10 runs
   * Order by timestamp
   * isPublic = true
   */
  getFirstRuns(): AngularFireList<Run> {
    return this.db.list(this.dbPath, ref => ref.orderByChild('isPublic'));
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
    return this.db.list(this.dbPath, ref => ref.orderByChild('timestamp').startAfter(lastItemTime).limitToLast(this.numberOfRunsToLoadLimit));
  }

  getAllRuns(): AngularFireList<Run> {
    return this.runs;
  }
}
