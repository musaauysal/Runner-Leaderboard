import { Component, ViewChild } from '@angular/core';
import {CSVRecordUsers} from './CSVRecordUsers';
import {CSVRecordPace} from './CSVRecordPace';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Runner-leaderboard';

  public records: any[] = [];
  public records2: any[] = [];
  public userNames: string[] = [];
  public keyarr: number[];
  public leaderarr: string[] = [];
  @ViewChild('csvReader') csvReader: any;
  @ViewChild('csvReader2') csvReader2: any;
  uploadListener($event: any): void {

    const text = [];
    const files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);
        const headersRow = this.getHeaderArray(csvRecordsArray);
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };

      // tslint:disable-next-line:only-arrow-functions typedef
      reader.onerror = function() {
        console.log('error is occured while reading file!');
      };

    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }
  uploadListener2($event: any): void {

    const text = [];
    const files2 = $event.srcElement.files;

    if (this.isValidCSVFile(files2[0])) {

      const input2 = $event.target;
      const reader2 = new FileReader();
      reader2.readAsText(input2.files[0]);
      reader2.onload = () => {
        const csvData2 = reader2.result;
        const csvRecordsArray2 = (csvData2 as string).split(/\r\n|\n/);
        const headersRow2 = this.getHeaderArray(csvRecordsArray2);
        this.records2 = this.getDataRecordsArrayFromCSVFile2(csvRecordsArray2, headersRow2.length);
        let currenusertid;
        let avgspeed;
        const idavgspeed = new Map< number, number>();
        for (let i = 0; i < 15; i++){
          currenusertid = this.records2[i].userid;
          avgspeed = this.records2[i].distance / this.records2[i].total_time;
          idavgspeed.set(currenusertid, avgspeed);
        }
        const idavgspeedsort = new Map([...idavgspeed.entries()].sort((a, b) => b[1] - a[1]));
        console.log(idavgspeedsort);
        const keys = [...idavgspeedsort.keys()];
        const users = keys.map(id => this.records.find(user => user.userid === id));
        const userNames = users.map((user, k) => user ? user.username : `#${k} Kişi kullanıcılar arasında yok`);
        this.userNames = userNames;
        console.log(userNames);
      };
      // tslint:disable-next-line:only-arrow-functions typedef
      reader2.onerror = function() {
        console.log('error is occured while reading file!');
      };

    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }
  // tslint:disable-next-line:typedef
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    const csvArr = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      const curruntRecord = (csvRecordsArray[i] as string).split(',');
      // tslint:disable-next-line:triple-equals
      if (curruntRecord.length == headerLength) {
        const csvRecord: CSVRecordUsers = new CSVRecordUsers();
        csvRecord.userid = curruntRecord[0].trim();
        csvRecord.username = curruntRecord[1].trim();
        csvRecord.age = curruntRecord[2].trim();
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }
  // tslint:disable-next-line:typedef
  getDataRecordsArrayFromCSVFile2(csvRecordsArray: any, headerLength: any) {
    const csvArr2 = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      const curruntRecord = (csvRecordsArray[i] as string).split(',');
      // tslint:disable-next-line:triple-equals
      if (curruntRecord.length == headerLength) {
        const csvRecord: CSVRecordPace = new CSVRecordPace();
        console.log(csvRecord[2]);
        csvRecord.userid = curruntRecord[0].trim();
        csvRecord.total_time = curruntRecord[1].trim();
        csvRecord.distance = curruntRecord[2].trim();
        csvArr2.push(csvRecord);
      }
    }
    return csvArr2;
  }

  // tslint:disable-next-line:typedef
  isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  // tslint:disable-next-line:typedef
  getHeaderArray(csvRecordsArr: any) {
    const headers = (csvRecordsArr[0] as string).split(',');
    const headerArray = [];
    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }


  // tslint:disable-next-line:typedef
  fileReset() {
    this.csvReader.nativeElement.value = '';
    this.records = [];
  }
}
