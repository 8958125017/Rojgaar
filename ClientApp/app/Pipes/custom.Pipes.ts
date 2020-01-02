import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
 

@Pipe({
  name: 'DateFormatPipe',
})
export class DateFormatPipe implements PipeTransform {
  transform(date: any, args?: any): any {
    let d = new Date(date)
    return moment(d).format('DD/MM/YYYY')

  }
}


@Pipe({
  name: 'toFloat'
})
export class IntToFloat implements PipeTransform {
  transform(value: number): any {
    return value.toFixed(2)
  }
}
//@Pipe({
//  name: 'striphtml'
//})

//export class StripHtmlPipe implements PipeTransform {
//  transform(value: string): any {
//    return value.replace(/<.*?>/g, ''); // replace tags
//  }
//}


// @Pipe({name: 'convertFrom24To12Format'})
// export class TimeFormat implements PipeTransform {
//      transform(time: any): any {
//          let hour = (time.split(':'))[0]
//          let min = (time.split(':'))[1]
//          let part = hour > 12 ? 'pm' : 'am';
//          min = (min+'').length == 1 ? `0${min}` : min;
//          hour = hour > 12 ? hour - 12 : hour;
//          hour = (hour+'').length == 1 ? `0${hour}` : hour;
//          return `${hour}:${min} ${part}`
//        }
//    }