import { Injectable } from '@angular/core';
import { Run } from '../models/models';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class RunService {
  private dbPath = '/runs';

  runs: AngularFireList<Run>;
  currentIndex: number = 10;
  kmResult: number = 0;

  constructor(private db: AngularFireDatabase) {
    this.runs = this.db.list(this.dbPath, ref => ref.orderByChild('timestamp').limitToFirst(this.currentIndex));
    //this.kmResult = this.db.list(this.dbPath, ref => ref.);
  }

  addRun(run: Run): any {
    return this.runs.push(run);
  }

  getFirstRuns(): AngularFireList<Run> {
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
  loadMoreRuns(lastItemTime: number): AngularFireList<Run> {
    const moreRuns: AngularFireList<Run> = this.db.list(this.dbPath, ref => ref.orderByChild('timestamp').startAfter(lastItemTime).limitToFirst(10));
    return moreRuns;
  }
}
