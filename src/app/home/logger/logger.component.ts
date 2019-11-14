import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/core/services/logger.service';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit {

  logs = [];

  constructor(private _logger: LoggerService) {
    this.logs = _logger.logs;
  }

  ngOnInit() { }

}
