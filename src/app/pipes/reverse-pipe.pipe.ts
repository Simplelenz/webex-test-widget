import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'reversePipe'
})
export class ReversePipePipe implements PipeTransform {

  transform(value) {
    return value.slice().reverse();
  }

}
