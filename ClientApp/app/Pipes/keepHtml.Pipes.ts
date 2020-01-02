import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeScript, SafeResourceUrl, SafeUrl, SafeValue,SafeStyle } from '@angular/platform-browser';

@Pipe({ name: 'KeepHtml',})
export class KeepHtml implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }
  //transform(content:any) {
  //  return this.sanitizer.bypassSecurityTrustHtml(content);
  //}
  public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default: throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
