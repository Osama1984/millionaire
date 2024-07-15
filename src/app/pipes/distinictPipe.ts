import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distinctUntilChanged',
  standalone: true
})
export class DistinctUntilChangedPipe implements PipeTransform {
  private previousValue: any[] = [];

  transform(value: any[]): any[] {
    if (!Array.isArray(value) || value.length === 0) {
      return value;
    }

    // Sort the arrays and compare
    const sortedPrev = [...this.previousValue].sort();
    const sortedCurr = [...value].sort();
    if (JSON.stringify(sortedPrev) === JSON.stringify(sortedCurr)) {
      return this.previousValue;
    } else {
      this.previousValue = value;
      return value;
    }
  }
}