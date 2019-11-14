import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private _logs: string[] = [];

  constructor() { }

  set log(message: string) {
    this._logs.push(message)
  }

  get logs() {
    return this._logs;
  }

  clearLogs() {
    this._logs = []
  }
}
