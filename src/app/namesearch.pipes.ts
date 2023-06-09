import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'nameContains',
    standalone: true
})
export class nameContainsPipe implements PipeTransform {
  transform(value: any[], term: string): any[] {
    console.log(term);
    if (value instanceof Array) {
      return value.filter(
        (x: any) =>
          x.rname.toLowerCase().indexOf(term.toLowerCase()) >= 0  ||
          x.cname.toLowerCase().indexOf(term.toLowerCase()) >= 0
      );
    }
    return [];
  }
}