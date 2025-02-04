export class Run {
  key?: string | null;
  name?: string;
  vorname?: string;
  datum?: string | null;
  km?: number;
  picture?: string;
  ort?: string;
  werbung?: boolean;
  email?: string;
  timestamp?: number | null;
  isPublic?: boolean;
}

export class Score {
  key?: string | null;
  name?: string;
  vorname?: string;
  km?: number;
}
