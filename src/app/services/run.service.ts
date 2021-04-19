import { Injectable } from '@angular/core';
import { Run } from '../models/models';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RunService {
  private dbPath = '/runs';

  runs: AngularFirestoreCollection<Run>;

  constructor(private db: AngularFirestore) {
    this.runs = db.collection(this.dbPath);
  }

  addRun(run: Run): void {
    this.runs.add({...run});
  }

  getRuns(): AngularFirestoreCollection<Run> {
    return this.runs;
  }
}
