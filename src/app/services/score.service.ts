import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Score } from '../models/run';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  private dbPathScore = '/score';

  score: AngularFireList<Score>;
  numberOfRunsToLoadLimit: number = 10;

  constructor(private db: AngularFireDatabase) {
    this.score = this.db.list(this.dbPathScore, ref => ref.orderByChild('km'));
  }

  getScore(): AngularFireList<Score> {
    return this.score;
  }
}
