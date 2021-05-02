import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import Score from '../models/score';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private dbPath = '/score';

  score: AngularFireList<Score>;

  constructor(private db: AngularFireDatabase) {
    this.score = this.db.list(this.dbPath);
  }

  getScore(): AngularFireList<Score> {
    return this.score;
  }

  updateScore(key: string, value: any): Promise<void> {
    return this.score.update(key, value);
  }
}
