import {Component, OnInit} from '@angular/core';
import {combineLatest, Observable} from "rxjs";
import {ActiveClosedDay, ActiveClosingDays, Campus} from "../entities";
import {CampusService} from "../campus.service";
import * as moment from "moment";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-campus-list',
  templateUrl: './campus-list.component.html',
  styleUrls: ['./campus-list.component.scss']
})
export class CampusListComponent implements OnInit {

  campuses$: Observable<Campus[]>;
  closingDays$: Observable<Map<string, ActiveClosedDay>>;

  campusInfo$: Observable<CampusInfo[]>;

  constructor(
    private campusService: CampusService,
  ) {
    this.campuses$ = this.campusService.getAllCampuses();

    this.closingDays$ = this.campusService.getActiveClosingDays(moment.utc())
      .pipe(
        map((value: ActiveClosingDays) => {
          const result = new Map<string, ActiveClosedDay>();

          for (const campus in value.closing_days) {
            result.set(campus, value.closing_days[campus]);
          }

          return result;
        })
      );

    this.campusInfo$ = combineLatest(this.campuses$, this.closingDays$)
      .pipe(
        map(data => {
          const campuses = <Campus[]>data[0];
          const closingDays = <Map<string, ActiveClosedDay>>data[1];

          return campuses.map(value => ({
            campus: value,
            closed_info: closingDays.get(value.short_name),
          }));
        })
      );
  }

  ngOnInit(): void {
  }

  isCampusClosed(campusInfo: CampusInfo) {
    return 'closed_info' in campusInfo && campusInfo['closed_info'];
  }

  getCampusSubscript(campusInfo: CampusInfo): string {
    if (this.isCampusClosed(campusInfo)) {
      // return 'Closed for X (DD-MM-YYYY - DD-MM-YYYY)';
      console.log(campusInfo);
      return campusInfo.closed_info?.reason['en_US'] || 'Closed';
      // return 'Closed for X (DD\xa0Month - DD\xa0Month)'; // Alternatively. \xa0 == non breaking space
    }
    // return 'Open from 11:45 to 13:45';
    // return 'Open from Monday to Friday';
    // TODO: Opening hours
    return '';
  }
}

interface CampusInfo {
  campus: Campus;
  closed_info?: ActiveClosedDay;
}